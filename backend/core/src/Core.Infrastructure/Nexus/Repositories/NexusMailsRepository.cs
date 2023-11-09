// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.MailAggregate;
using Core.Domain.Repositories;
using Nexus.Sdk.Shared.Responses;
using Nexus.Sdk.Token;

namespace Core.Infrastructure.Nexus.Repositories
{
    public class NexusMailsRepository : IMailsRepository
    {
        private readonly ITokenServer _tokenServer;

        public NexusMailsRepository(ITokenServer tokenServer)
        {
            _tokenServer = tokenServer;
        }

        public async Task<IEnumerable<Mail>> GetMailsAsync(string status, CancellationToken cancellationToken = default)
        {
            var query = new Dictionary<string, string>()
            {
                {
                    "status", status
                }
            };

            var response = await _tokenServer.Compliance.Mails.Get(query);

            var mails = response.Records;

            var items = new List<Mail>();

            foreach (var mail in mails)
            {
                var item = ConvertToMailAsync(mail, cancellationToken);
                items.Add(item);
            }

            return items;
        }

        private static Mail ConvertToMailAsync(MailsResponse mail, CancellationToken cancellationToken = default)
        {
            var response = new Mail
            {
                Code = mail.Code,
                Type = mail.Type,
                Status = mail.Status,
                Content = new Domain.Entities.MailAggregate.MailContent
                {
                    Html = mail.Content.Html,
                    Subject = mail.Content.Subject,
                    Text = mail.Content.Text
                },
                Count = mail.Count,
                Created = mail.Created,
                Recipient = new Domain.Entities.MailAggregate.MailRecipient
                {
                    BCC = mail.Recipient.BCC,
                    CC = mail.Recipient.CC,
                    Email = mail.Recipient.Email
                },
                References = new Domain.Entities.MailAggregate.MailEntityCodes
                {
                    AccountCode = mail.References.AccountCode,
                    CustomerCode = mail.References.CustomerCode,
                    TransactionCode = mail.References.TransactionCode
                },
                Sent = mail.Sent
            };

            return response;
        }
    }
}
