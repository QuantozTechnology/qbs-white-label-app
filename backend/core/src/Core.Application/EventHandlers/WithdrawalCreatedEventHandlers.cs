// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Abstractions;
using Core.Domain.Entities.CallbackAggregate;
using Core.Domain.Events;
using Core.Domain.Repositories;
using MediatR;
using System.Text.Json;

namespace Core.Application.EventHandlers
{
    public class WithdrawalCreatedEventHandlers : INotificationHandler<WithdrawalCreatedEvent>
    {
        private readonly IEmailService _emailService;

        public WithdrawalCreatedEventHandlers(
            IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task Handle(WithdrawalCreatedEvent notification, CancellationToken cancellationToken)
        {
            var withdrawal = notification.Withdraw;
            var customer = notification.Customer;

            var templateId = "your-sendgrid-template-id";

            var templateData = new Dictionary<string, object>
            {
                { "customerFullName", $"{customer.GetName()}"},
                { "amount", notification.Withdraw.Amount },
                { "accountCode", notification.Withdraw.PublicKey },
                { "createdDate", DateTime.UtcNow },
               // { "customerBankAccount", notification.Withdraw. },
               // { "transactionCode", notification.TransactionCode }
            };

            await _emailService
                .SendEmailAsync(new List<string> { "neha@quantoz.com" }, templateData, templateId);

        }
    }
}
