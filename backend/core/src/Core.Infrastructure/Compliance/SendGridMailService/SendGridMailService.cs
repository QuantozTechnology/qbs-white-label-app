// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Abstractions;
using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Entities.MailAggregate;
using Core.Domain.Exceptions;
using Core.Infrastructure.Nexus;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net;

namespace Core.Infrastructure.Compliance.IPLocator
{
    public class SendGridMailService : ISendGridMailService
    {
        private readonly SendGridClient _sendGridClient;
        private readonly SendGridMailServiceOptions _mailOptions;

        public SendGridMailService(
            SendGridMailServiceOptions mailOptions)
        {
            _mailOptions = mailOptions;
            _sendGridClient = new SendGridClient(_mailOptions.ApiKey);
        }

        public async Task SendMailAsync(Mail mail, Customer customer, decimal amount)
        {
            if (mail == null)
            {
                throw new CustomErrorsException("MailService", "mail", "An error occured while sending mail.");
            }

            var from = new EmailAddress(_mailOptions.Sender);
            var to = new EmailAddress(mail.Recipient?.Email);
            var subject = mail.Content?.Subject;
            var htmlContent = mail.Content?.Html;
            var plainTextContent = mail.Content?.Text;

            if (to == null)
            {
                throw new CustomErrorsException("MailService", "toAddress", "An error occured while sending mail.");
            }

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

            // If mail types is TransactionSellFinish which is Payout
            if (mail.Type == MailType.TransactionSellFinish.ToString())
            {
                msg.SetTemplateId(_mailOptions.Templates.WithdrawalTemplateID);
            }
            else // convert to else if
            {
                msg.SetTemplateId(_mailOptions.Templates.FundingtemplateID);
            }

            // Fill in the dynamic template fields
            msg.AddSubstitution("{{ customerFullName }}", customer?.GetName());
            msg.AddSubstitution("{{ amount }}", amount.ToString());
            msg.AddSubstitution("{{ accountCode }}", mail.References?.AccountCode);
            msg.AddSubstitution("{{ customerBankAccount }}", customer?.BankAccount);
            msg.AddSubstitution("{{ transactionCode }}", mail.References?.TransactionCode);
            msg.AddSubstitution("{{ createdDate }}", mail.Created);

            var response = await _sendGridClient.SendEmailAsync(msg);

            if (response.StatusCode != HttpStatusCode.Accepted)
            {
                throw new CustomErrorsException("MailService", "mail", "An error occured while sending mail.");
            }
        }
    }
}
