// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Abstractions;
using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Entities.MailAggregate;
using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Exceptions;
using Core.Infrastructure.Nexus;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net;

namespace Core.Infrastructure.Compliance.SendGridMailService
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

        public async Task SendMailAsync(Mail mail, Customer customer, Transaction transaction)
        {
            if (mail == null)
            {
                throw new CustomErrorsException("MailService", "mail", "An error occured while sending mail.");
            }

            var from = new EmailAddress(_mailOptions.Sender);
            var to = new EmailAddress(mail.Recipient?.Email?.ToLower().Trim()) ?? throw new CustomErrorsException("MailService", "toAddress", "An error occured while sending mail.");

            var msg = new SendGridMessage();

            msg.SetFrom(new EmailAddress(from.Email, from.Name));
            msg.AddTo(new EmailAddress(to.Email, to.Name));

            // Payout
            if (mail.Type == MailType.TransactionSellFinish.ToString())
            {
                msg.SetTemplateId(_mailOptions.Templates.WithdrawalTemplateID);
            }
            else if (mail.Type == MailType.TransactionBuyFinish.ToString())
            {
                msg.SetTemplateId(_mailOptions.Templates.FundingtemplateID);
            }

            // Fill in the dynamic template fields
            var templateData = new MailTemplate()
            {
                CustomerFullName = customer?.GetName(),
                AccountCode = mail.References?.AccountCode,
                TransactionCode = mail.References?.TokenPaymentCode,
                BankAccount = customer?.BankAccount,
                Amount = transaction.Amount.ToString(),
                CreatedDate = DateTimeProvider.FormatDateTimeWithoutMilliseconds(transaction.Created),
                FinishedDate = DateTimeProvider.FormatDateTimeWithoutMilliseconds(transaction.Finished)
            };

            if (mail.Type == MailType.TransactionSellFinish.ToString())
            {
                //TODO: set payout amount when transaction details in nexus api would also return the net fiat amount
                //templateData.PayoutAmount = transaction.NetFiatAmount.ToString()
            }

            msg.SetTemplateData(templateData);

            var response = await _sendGridClient.SendEmailAsync(msg);

            if (response.StatusCode != HttpStatusCode.Accepted)
            {
                throw new CustomErrorsException("MailService", "mail", "An error occured while sending mail.");
            }
        }

        public async Task SendOTPCodeMailAsync(Customer customer, string otpCode)
        {
            var from = new EmailAddress(_mailOptions.Sender);
            var to = new EmailAddress(customer.Email?.ToLower().Trim());
            var msg = new SendGridMessage();

            msg.SetFrom(new EmailAddress(from.Email, from.Name));
            msg.AddTo(new EmailAddress(to.Email, to.Name));

            msg.SetTemplateId(_mailOptions.Templates.OTPCodeTemplateID);

            // Fill in the dynamic template fields
            var templateData = new OTPCodeMailTemplate()
            {
                CustomerFullName = customer?.GetName(),
                OTPCode = otpCode
            };

            msg.SetTemplateData(templateData);

            var response = await _sendGridClient.SendEmailAsync(msg);

            if (response.StatusCode != HttpStatusCode.Accepted)
            {
                throw new CustomErrorsException("MailService", "mail", "An error occured while sending mail.");
            }
        }
    }
}
