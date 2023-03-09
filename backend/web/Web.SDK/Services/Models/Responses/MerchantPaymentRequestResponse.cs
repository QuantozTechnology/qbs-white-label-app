// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Web.SDK.Services.Models.Responses
{
    public class MerchantPaymentRequestResponse : PaymentRequestResponse
    {
        public required MerchantSettingsResponse MerchantSettings { get; set; }
    }

    public class MerchantSettingsResponse
    {
        public required string ReturnUrl { get; set; }
        public required string RedirectUrl { get; set; }
    }
}
