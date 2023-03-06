using SigningService.API.Data;
using SigningService.API.Models.Projection;
using System;
using System.Linq;

namespace SigningService.API.Repository;

public class SigningPairRepository : ISigningPairRepository
{
    private SigningDbContext DbContext { get; }

    public SigningPairRepository(SigningDbContext dbContext)
    {
        DbContext = dbContext;
    }

    public IQueryable<SigningPairDTO> Query()
    {
        return DbContext.SigningPairs
            .Select(SigningPairProjection.ConvertToDTO);
    }

    public int GetNextHDIndex(string cryptoCode, string labelPartnerCode)
    {
        var query = Query()
            .Where(x => x.CryptoCode == cryptoCode && x.LabelPartnerCode == labelPartnerCode);

        var index = query
            .OrderByDescending(c => c.Index)
            .FirstOrDefault()?.Index;

        return index + 1 ?? 1;
    }

    public SigningPairDTO GetSigningPair(string publicKey)
    {
        var pair =
            DbContext.SigningPairs
            .SingleOrDefault(x => x.PublicKey == publicKey);

        if (pair != null)
        {
            return SigningPairProjection.ConvertToDTO.Compile().Invoke(pair);
        }

        return null;
    }

    public SigningPairDTO GetSigningPair(string cryptoCode, string labelPartnerCode, string publicKey)
    {
        var pair =
            DbContext.SigningPairs
            .SingleOrDefault(x => x.CryptoCode == cryptoCode && x.LabelPartnerCode == labelPartnerCode && x.PublicKey == publicKey);

        if (pair != null)
        {
            return SigningPairProjection.ConvertToDTO.Compile().Invoke(pair);
        }

        return null;
    }

    /// <summary>
    /// creates a keypair based upon crypto and encrypt the private key and then store them in the db
    /// </summary>
    /// <returns></returns>
    public string CreateSigningpairPerAllowedCrypto(SigningPairDTO signPairDTO)
    {
        if (signPairDTO == null)
        {
            throw new Exception("Keypair generation failed. See logs for more information.");
        }

        try
        {
            var ent = SigningPairProjection.ConvertFromDTO(signPairDTO);

            if (ent.Index == null)
            {
                throw new Exception("Index cannot be null.");
            }

            DbContext.SigningPairs.Add(ent);
            DbContext.SaveChanges();

            return ent.PublicKey;
        }
        catch
        {
            throw new Exception("Creation of signing pair failed due to database error.");
        }
    }

    public int SaveChanges()
    {
        return DbContext.SaveChanges();
    }
}
