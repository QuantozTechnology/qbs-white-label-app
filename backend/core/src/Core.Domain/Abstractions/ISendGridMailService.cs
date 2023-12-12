// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Entities.MailAggregate;
using Core.Domain.Entities.TransactionAggregate;

namespace Core.Domain.Abstractions
{
    public interface ISendGridMailService
    {
        public Task SendMailAsync(Mail mail, Customer customer, Transaction transaction);
    }
}