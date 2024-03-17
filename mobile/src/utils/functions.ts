import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import { fromByteArray } from "react-native-quick-base64";
import { isNil } from "lodash";
import { paymentsApi } from "./axios";
import "react-native-get-random-values";

export const generateKeys = async () => {
  ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
  ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

  const privKey = ed.utils.randomPrivateKey();
  const pubKey = ed.getPublicKey(privKey);
  const privKeyBase64 = fromByteArray(privKey);
  const pubKeyBase64 = fromByteArray(pubKey);
  return { pubKey: pubKeyBase64, privKey: privKeyBase64 };
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

export const verifyDevice = async (pubKey: string, oid: string) => {
  console.log("deviceVerification: pubKey: ", pubKey, "oid: ", oid);
  const result = await paymentsApi.post("/api/customers/devices", {
    publicKey: pubKey,
  });
  if (isNil(result)) {
    return { data: { value: { otpSeed: null } } };
  }

  return result.data;
};
export const registerDevice = async (pubKey: string, oid: string) => {
  const response = await verifyDevice(pubKey, oid);
  if (response) {
    const otpSeed = isNil(response?.data?.value?.otpSeed)
      ? null
      : response?.data?.value?.otpSeed;
    if (otpSeed) {
      await SecureStore.setItemAsync(oid + "otpSeed", otpSeed);
    }
    await AsyncStorage.setItem(oid + "deviceVerified", "true");
    return true;
  } else {
    return false;
  }
};
export const getStoredKeys = async (oid: string) => {
  if (isNil(oid)) {
    return { pubKey: null, privKey: null };
  }
  const publicKey = await SecureStore.getItemAsync(oid + "_publicKey");
  const privateKey = await SecureStore.getItemAsync(oid + "_privateKey");
  const deviceVerified = await AsyncStorage.getItem(oid + "deviceVerified");
  if (isNil(publicKey) || isNil(privateKey)) {
    const keys = await renewKeys(oid);
    // verify device
    const pubKey = keys.pubKey;
    await registerDevice(pubKey, oid);
    return keys;
  }
  if (isNil(deviceVerified)) {
    await registerDevice(publicKey, oid);
  }
  return { pubKey: publicKey, privKey: privateKey };
};

export const getOid = async (): Promise<string | false> => {
  const oid = await SecureStore.getItemAsync("oid");
  if (isNil(oid)) {
    return false;
  }
  return oid;
};

export const getNextStep = async () => {
  const oid = await SecureStore.getItemAsync("oid");
  if (isNil(oid)) {
    return "welcome";
  }
  const deviceVerified = await AsyncStorage.getItem(oid + "deviceVerified");
  const pubKey = await SecureStore.getItemAsync(oid + "_publicKey");
  const privKey = await SecureStore.getItemAsync(oid + "_privateKey");
  const RegistrationCompleted = await SecureStore.getItemAsync(
    oid + "RegistrationCompleted"
  );

  if (pubKey && privKey) {
    if (deviceVerified) {
      if (RegistrationCompleted) return "autologin";
      else return "register";
    }
  } else {
    return "verifyDevice";
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlePageType = async (setCurrentPageType: any) => {
  getAllStoredData();
  const oid = await getOid();

  if (!oid) {
    setCurrentPageType("SignIn");
    return;
  }

  const storedKeys = await getStoredKeys(oid);
  const isRegistrationCompleted = await SecureStore.getItemAsync(
    `${oid}RegistrationCompleted`
  );
  const deviceVerified = await AsyncStorage.getItem(oid + "deviceVerified");

  if (storedKeys.pubKey && isRegistrationCompleted) {
    setCurrentPageType("AutoLogin");
  } else if (storedKeys.pubKey && !deviceVerified && !isRegistrationCompleted) {
    setCurrentPageType("DeviceVerification");
  } else if (storedKeys.pubKey && deviceVerified && !isRegistrationCompleted) {
    setCurrentPageType("RegistrationCompleteForm");
  } else {
    setCurrentPageType("SignIn");
  }
};

// Todo: we should merge this one with handlePageType
export const getPageType = async () => {
  const oid = await getOid();
  if (!oid) {
    return "SignIn";
  }

  const storedKeys = await getStoredKeys(oid);
  const isRegistrationCompleted = await SecureStore.getItemAsync(
    `${oid}RegistrationCompleted`
  );
  const deviceVerified = await AsyncStorage.getItem(oid + "deviceVerified");

  if (storedKeys.pubKey && isRegistrationCompleted) {
    return "AutoLogin";
  } else if (storedKeys.pubKey && !deviceVerified && !isRegistrationCompleted) {
    return "DeviceVerification";
  } else if (storedKeys.pubKey && deviceVerified && !isRegistrationCompleted) {
    return "RegistrationCompleteForm";
  }
  return "SignIn";
};

export const removeAllStoredData = async (whocallthisfunc: string) => {
  // check if there is an oid
  const oid = await SecureStore.getItemAsync("oid");
  await SecureStore.deleteItemAsync(oid + "_publicKey");
  await SecureStore.deleteItemAsync(oid + "_privateKey");
  await SecureStore.deleteItemAsync(oid + "_deviceRegistered");
  await SecureStore.deleteItemAsync("oid");
  await SecureStore.deleteItemAsync("email");
  await SecureStore.deleteItemAsync("phoneNumber");
  await SecureStore.deleteItemAsync(oid + "RegistrationCompleted");
  await AsyncStorage.removeItem(oid + "deviceVerified");
  console.log("All stored data removed. request from: ", whocallthisfunc);
};

export const removeStoredKeys = async (whocallthisfunc: string) => {
  const oid = await SecureStore.getItemAsync("oid");
  await SecureStore.deleteItemAsync(oid + "_publicKey");
  await SecureStore.deleteItemAsync(oid + "_privateKey");
  console.log("Stored keys removed. request from: ", whocallthisfunc);
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
  const deviceVerified = await AsyncStorage.getItem(oid + "deviceVerified");
  const RegistrationCompleted = await SecureStore.getItemAsync(
    oid + "RegistrationCompleted"
  );
  console.warn("oid: ", oid);
  console.warn("publicKey: ", publicKey);
  console.warn("privateKey: ", privateKey);
  console.warn("deviceRegistered: ", deviceRegistered);
  console.warn("email: ", email);
  console.warn("phoneNumber: ", phoneNumber);
  console.warn("deviceVerified: ", deviceVerified);
  console.warn("RegistrationCompleted: ", RegistrationCompleted);
};

export const setSecureStoreData = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};
