// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;

namespace Core.Presentation.Models.Responses.CustomerResponses
{
    public class DeviceAuthenticationResponse
    {
        public required string OTPSeed { get; set; }

        public static DeviceAuthenticationResponse FromOTPKey(DeviceAuthentication device)
        {
            return new DeviceAuthenticationResponse
            {
                OTPSeed = device.OTPKey
            };
        }
    }
}
