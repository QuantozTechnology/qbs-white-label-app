// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.MailAggregate;

namespace Core.Domain.Repositories
{
    public interface IMailsRepository
    {
        Task<IEnumerable<Mail>> GetMailsAsync(string status, CancellationToken cancellationToken = default);

        Task<Mail> UpdateMailSent(string code, CancellationToken cancellationToken = default);
    }
}
