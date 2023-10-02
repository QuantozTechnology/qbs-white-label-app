export interface DevicesPayload {
  publicKey: string;
  otpCode?: string;
}

export interface Device {
  otpSeed: string;
}
