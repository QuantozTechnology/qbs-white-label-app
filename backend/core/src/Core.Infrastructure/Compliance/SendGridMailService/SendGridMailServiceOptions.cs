// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.ComponentModel.DataAnnotations;

namespace Core.Infrastructure.Compliance.SendGridMailService
{
    public class SendGridMailServiceOptions
    {
        [Required]
        public required string ApiKey { get; set; }

        [Required]
        public required Templates Templates { get; set; }

        [Required]
        public required string Sender { get; set; }
    }

    public class Templates
    {
        [Required]
        public required string WithdrawalTemplateID { get; set; }

        [Required]
        public required string FundingtemplateID { get; set; }

        [Required]
        public required string OTPCodeTemplateID { get; set; }
    }
}
