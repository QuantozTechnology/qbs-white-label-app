﻿// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Primitives.PaymentRequest
{
    public class MerchantSettings
    {
        public string? CallbackUrl { get; set; }
        public string ReturnUrl { get; set; }

        public MerchantSettings(string returnUrl)
        {
            ReturnUrl = returnUrl;
        }
    }
}
