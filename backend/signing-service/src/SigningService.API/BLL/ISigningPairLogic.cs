// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using FluentResults;
using SigningService.API.Models.Requests;
using SigningService.API.Models.Responses;

namespace SigningService.API.BLL;

public interface ISigningPairLogic
{
    Result<SigningPairResponseModel> CreateSigningPair(AllowedCryptos crypto, string labelPartnerCode);
    Result<SignatureResponseModel> CreateSignature(CreateSignatureRequestModel createSignature);
    Result GenerateMnemonic(GenerateMnemonicModel generateMnemonic);
}
