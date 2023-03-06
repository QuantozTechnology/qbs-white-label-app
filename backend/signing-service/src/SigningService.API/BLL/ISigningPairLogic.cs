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
