// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Abstractions
{
    public interface ICustomerOTPGenerator
    {
        Task<string> GenerateNewOTPKey();

        bool VerifyOTP(string otpKey, string otpCode);

        string GenerateOTPCode(string otpKey);
    }
}