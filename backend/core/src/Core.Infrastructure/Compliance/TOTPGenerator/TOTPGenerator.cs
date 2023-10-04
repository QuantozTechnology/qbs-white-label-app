// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Abstractions;
using Core.Domain.Exceptions;
using OtpNet;

namespace Core.Infrastructure.CustomerFileStorage
{
    public class TOTPGenerator : ICustomerOTPGenerator
    {
        // Length of the generated OTP key (in digits).
        private const int OTPKeyLength = 20;

        public async Task<string> GenerateNewOTPKey()
        {
            try
            {
                var keyBytes = KeyGeneration.GenerateRandomKey(OTPKeyLength);

                // Convert the key bytes to a base32-encoded string (standard for TOTP)
                var base32Secret = Base32Encoding.ToString(keyBytes);

                return await Task.FromResult(base32Secret);
            }
            catch
            {
                throw new CustomErrorsException("OTPGenerator", null, "An error occured while generating the OTP Key.");
            }
        }

        public bool VerifyOTP(string otpKey, string otpCode)
        {
            try
            {
                // Convert the OTPKey to bytes (from base32 encoding)
                var keyBytes = Base32Encoding.ToBytes(otpKey);

                // Create a TOTP generator with the key and time step
                var totp = new Totp(keyBytes, step: 30);

                // Verify the OTP code
                return totp.VerifyTotp(otpCode, out _, VerificationWindow.RfcSpecifiedNetworkDelay);
            }
            catch
            {
                throw new CustomErrorsException("OTPGenerator", null, "An error occured while verifying the OTPCode.");
            }
        }

        public string GenerateOTPCode(string otpKey)
        {
            try
            {
                // Convert the OTPKey to bytes (from base32 encoding)
                var keyBytes = Base32Encoding.ToBytes(otpKey);

                // Create a TOTP generator with the key and time step (default is 30 seconds)
                var totp = new Totp(keyBytes);

                // Generate the OTP code for the current time
                var otpCode = totp.ComputeTotp();

                return otpCode;
            }
            catch
            {
                throw new CustomErrorsException("OTPGenerator", null, "An error occured while generating the OTPCode.");
            }
        }
    }
}