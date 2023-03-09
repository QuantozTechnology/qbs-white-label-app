// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Infrastructure.Compliance.IPLocator.Models;

namespace Core.Infrastructure.Compliance.IPLocator
{
    public interface IIPLocator
    {
        Task<ISPResponse> GetISP(string ip);
    }
}
