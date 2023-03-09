// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using SigningService.API.Models.Projection;

namespace SigningService.API.Repository;

public interface ISigningPairRepository
{
    string CreateSigningpairPerAllowedCrypto(SigningPairDTO signingPairDTO);
    int SaveChanges();
    SigningPairDTO GetSigningPair(string publicKey);
    int GetNextHDIndex(string cryptoCode, string labelPartnerCode);

}
