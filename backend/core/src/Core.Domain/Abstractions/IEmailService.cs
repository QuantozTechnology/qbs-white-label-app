// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Abstractions
{
    public interface IEmailService
    {
        Task SendEmailAsync<T>(IEnumerable<string> recipients, T templateData, string templateId, string? subject = null);
    }
}
