// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Entities.MailAggregate
{
    public class Mail
    {
        public required string Code { get; set; }

        public string? Created { get; set; }

        public string? Sent { get; set; }

        public string? Status { get; set; }

        public string? Type { get; set; }

        public int? Count { get; set; }

        public MailEntityCodes? References { get; set; }

        public MailContent? Content { get; set; }

        public MailRecipient? Recipient { get; set; }
    }

    public class MailEntityCodes
    {
        public string? AccountCode { get; set; }

        public string? CustomerCode { get; set; }

        public string? TransactionCode { get; set; }
    }

    public class MailContent
    {
        public string? Subject { get; set; }

        public string? Html { get; set; }

        public string? Text { get; set; }
    }

    public class MailRecipient
    {
        public string? Email { get; set; }

        public string? CC { get; set; }

        public string? BCC { get; set; }
    }
}
