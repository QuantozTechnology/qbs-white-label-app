// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Abstractions;
using Core.Domain.Entities.MailAggregate;
using Core.Infrastructure.Nexus;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net;

namespace Core.Infrastructure.Compliance.IPLocator
{
    public class SendGridMailService : ISendGridMailService
    {
        private readonly HttpClient _httpClient;
        private readonly SendGridClient _sendGridClient;
        private readonly SendGridMailServiceOptions _mailOptions;

        public SendGridMailService(
            HttpClient httpClient, 
            SendGridClient sendGridClient,
            SendGridMailServiceOptions mailOptions)
        {
            _mailOptions = mailOptions;
            _httpClient = httpClient;
            _sendGridClient = new SendGridClient(_mailOptions.ApiKey);
        }

        public async Task SendMailAsync<T>(Mail mail, string customerName, decimal amount)
        {
            if (mail == null)
            {
                var from = new EmailAddress(_mailOptions.Sender);
                var to = new EmailAddress(mail.Recipient.Email);
                var subject = mail.Content.Subject;
                var htmlContent = mail.Content.Html;
                var plainTextContent = mail.Content.Text;
                
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

                // Set the appropriate template ID based on the mail type
                if (mail.Type == MailType.TransactionSellFinish.ToString())
                {
                    msg.SetTemplateId(_mailOptions.Templates.WithdrawalTemplateID);

                    // Fill in the dynamic template fields
                    msg.AddSubstitution("{{ customerFullName }}", customerName);
                    msg.AddSubstitution("{{ amount }}", amount.ToString());
                    msg.AddSubstitution("{{ accountCode }}", mail.References.AccountCode);


                }

                var response = await _sendGridClient.SendEmailAsync(msg);

                if (response.StatusCode != HttpStatusCode.Accepted)
                {
                    // Handle failure to send email
                }
            }
        }
    }
}
