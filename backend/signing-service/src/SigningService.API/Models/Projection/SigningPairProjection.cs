using System;
using System.Linq.Expressions;
using SigningService.API.Data;

namespace SigningService.API.Models.Projection;

public class SigningPairProjection
{
    public static Expression<Func<SigningPair, SigningPairDTO>> ConvertToDTO
    {
        get
        {
            return kp => new SigningPairDTO
            {
                Id = kp.Id,
                PublicKey = kp.PublicKey,
                CreatedOn = kp.CreatedOn,
                Index = kp.Index,
                CryptoCode = kp.CryptoCode,
                LabelPartnerCode = kp.LabelPartnerCode
            };
        }
    }

    public static SigningPair ConvertFromDTO(SigningPairDTO sp)
    {
        return new SigningPair
        {
            Id = sp.Id,
            PublicKey = sp.PublicKey,
            CreatedOn = sp.CreatedOn,
            Index = sp.Index,
            CryptoCode = sp.CryptoCode,
            LabelPartnerCode = sp.LabelPartnerCode
        };
    }
}
