using SigningService.API.Models.Projection;

namespace SigningService.API.Repository;

public interface ISigningPairRepository
{
    string CreateSigningpairPerAllowedCrypto(SigningPairDTO signingPairDTO);
    int SaveChanges();
    SigningPairDTO GetSigningPair(string publicKey);
    int GetNextHDIndex(string cryptoCode, string labelPartnerCode);

}
