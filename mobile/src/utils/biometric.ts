import * as LocalAuthentication from "expo-local-authentication";

export async function isBiometricCheckSupportedByDevice(): Promise<boolean> {
  const supportsBiometric = await LocalAuthentication.hasHardwareAsync();
  const hasAlreadySetupBiometric = await LocalAuthentication.isEnrolledAsync();

  return supportsBiometric && hasAlreadySetupBiometric;
}

export async function biometricValidation(): Promise<{
  result: "success" | "error";
  message?: string;
}> {
  const isBiometricSupported = await isBiometricCheckSupportedByDevice();

  if (isBiometricSupported) {
    const response = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to use Quantoz Payments",
    });

    if (!response.success) {
      return { result: "error", message: response.error };
    }

    return { result: "success" };
  }

  // if not supported, just allow to go on
  return {
    result: "success",
  };
}
