// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.CustomerCommands;
using System.ComponentModel.DataAnnotations;

namespace Core.Presentation.Models.Requests.CustomerRequests
{
    public class CreateDeviceAuthenticationRequest
    {
        [Required]
        public required string PublicKey { get; set; }

        public string? OTPCode { get; set; }

        public DeviceAuthenticationCommand ToCommand(string customerCode, string ip)
        {
            return new DeviceAuthenticationCommand
            {
                CustomerCode = customerCode,
                PublicKey = PublicKey,
                OTPCode = OTPCode,
                IP = ip,
            };
        }
    }
}
