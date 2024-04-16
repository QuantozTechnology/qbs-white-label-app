import * as SecureStore from "expo-secure-store";
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import { fromByteArray } from "react-native-quick-base64";
import { isEmpty, isNil } from "lodash";
import { paymentsApi } from "./axios";
import "react-native-get-random-values";
import * as LocalAuthentication from "expo-local-authentication";
import {
  biometricValidation,
  isBiometricCheckSupportedByDevice,
} from "../utils/biometric";
import { AxiosError } from "axios";

export const generateKeys = async () => {
  ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
  ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

  const privKey = ed.utils.randomPrivateKey();
  const pubKey = ed.getPublicKey(privKey);
  const privKeyBase64 = fromByteArray(privKey);
  const pubKeyBase64 = fromByteArray(pubKey);
  return { pubKey: pubKeyBase64, privKey: privKeyBase64 };
};

export const sendOtpCodeToMail = async () => {
  try {
    const response = await paymentsApi.post("/api/customers/otp/email", {});
    return response;
  } catch (error) {
    //const axiosErrror = error as AxiosError;
    return "error";
  }
};

export const storeKeys = async (
  oid: string,
  pubKey: string,
  privKey: string
) => {
  await SecureStore.setItemAsync(oid + "_publicKey", pubKey);
  await SecureStore.setItemAsync(oid + "_privateKey", privKey);
};

export const renewKeys = async (oid: string) => {
  const keys = await generateKeys();
  await storeKeys(oid, keys.pubKey, keys.privKey);
  return keys;
};

export const verifyDevice = async (
  pubKey: string,
  oid: string,
  otpCode: string | null
) => {
  const otpSeed = await SecureStore.getItemAsync(oid + "otpSeed");
  if (!isNil(otpSeed) && !isEmpty(otpSeed)) {
    return { data: { value: { otpSeed: otpSeed } } };
  } else {
    try {
      const payload: { publicKey: string; otpCode?: string } = {
        publicKey: pubKey,
      };
      if (!isNil(otpCode)) {
        payload.otpCode = otpCode;
      }
      const result = await paymentsApi.post("/api/customers/devices", payload);
      if (result.status === 200) {
        if (result.data?.value?.otpSeed) {
          await SecureStore.setItemAsync(
            oid + "otpSeed",
            result.data.value.otpSeed
          );
          await SecureStore.setItemAsync(oid + "deviceVerified", "true");
          return true;
        } else {
          return result.data;
        }
      }
    } catch (error) {
      const axiosErrror = error as AxiosError;
      if (axiosErrror.response?.status == 409) {
        return { data: { error: "conflict" } };
      } else {
        return { data: { error: "error" } };
      }
    }
  }
};
export const registerDevice = async (pubKey: string, oid: string) => {
  const response = await verifyDevice(pubKey, oid, null);
  if (response) {
    if (response === true) {
      return true;
    } else {
      if (response?.data?.error === "conflict") {
        return "conflict";
      } else if (response?.data?.error === "error") {
        return "error";
      } else {
        return "error";
      }
    }
  } else {
    return false;
  }
};
export const checkStoredKeys = async (oid: string) => {
  if (isNil(oid)) {
    return false;
  }

  const publicKey = await SecureStore.getItemAsync(oid + "_publicKey");
  const privateKey = await SecureStore.getItemAsync(oid + "_privateKey");
  const otpSeed = await SecureStore.getItemAsync(oid + "otpSeed");

  if (isNil(publicKey) || isNil(privateKey)) {
    const keys = await renewKeys(oid);
    // verify device
    const pubKey = keys.pubKey;
    const deviceRegistered = await registerDevice(pubKey, oid);
    return deviceRegistered;
  }
  if (isNil(otpSeed)) {
    const deviceRegistered = await registerDevice(publicKey, oid);
    return deviceRegistered;
  }
};

export const getOid = async (): Promise<string | false> => {
  const oid = await SecureStore.getItemAsync("oid");
  if (isNil(oid)) {
    return false;
  }
  return oid;
};

export const removeStoredData = async (keys: string[]) => {
  for (const key of keys) {
    await SecureStore.deleteItemAsync(key);
  }
};

// For development: console log all stored data in secure store
export const getAllStoredData = async () => {
  const oid = await SecureStore.getItemAsync("oid");
  const publicKey = await SecureStore.getItemAsync(oid + "_publicKey");
  const privateKey = await SecureStore.getItemAsync(oid + "_privateKey");
  const deviceRegistered = await SecureStore.getItemAsync(
    oid + "_deviceRegistered"
  );
  const email = await SecureStore.getItemAsync("email");
  const phoneNumber = await SecureStore.getItemAsync("phoneNumber");
  //const deviceVerified = await SecureStore.getItemAsync(oid + "deviceVerified");
  const RegistrationCompleted = await SecureStore.getItemAsync(
    oid + "RegistrationCompleted"
  );
  console.warn("oid: ", oid);
  console.warn("publicKey: ", publicKey);
  console.warn("privateKey: ", privateKey);
  console.warn("deviceRegistered: ", deviceRegistered);
  console.warn("email: ", email);
  console.warn("phoneNumber: ", phoneNumber);
  console.warn("RegistrationCompleted: ", RegistrationCompleted);
};

export const setSecureStoreData = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const checkDeviceHasScreenLock = (
  callback: (result: boolean | null, error: { message: string } | null) => void
) => {
  LocalAuthentication.getEnrolledLevelAsync()
    .then((result) => {
      const hasScreenLockMechanism =
        result !== LocalAuthentication.SecurityLevel.NONE;
      callback(hasScreenLockMechanism, null); // First argument is result, second is error
    })
    .catch((error) => {
      callback(null, {
        message: "Error checking device screen lock mechanism" + error.message,
      });
    });
};

export const performBiometricValidation = async (
  callback: (
    biometricCheckStatus: "success" | "error" | "checking",
    error: { message: string } | null
  ) => void
) => {
  const isHardwareSupported = await isBiometricCheckSupportedByDevice();
  if (!isHardwareSupported) {
    callback("error", {
      message: "Biometric check is not supported",
    });
    console.warn("Biometric check is not supported", isHardwareSupported);
  } else {
    await biometricValidation()
      .then((result) => {
        console.warn("biometricValidation result", result);
        if (result.result === "success") {
          callback("success", null); // First argument is biometricCheckStatus, second is error
        } else if (result.result === "checking") {
          callback("checking", {
            message: "Biometric check is not supported",
          });
        } else if (result.result === "error") {
          callback("error", {
            message: result.message || "Biometric check failed",
          });
        } else {
          callback("error", {
            message: "Biometric check failed",
          });
        }
      })
      .catch(() => {
        // do nothing
      });
  }
};
