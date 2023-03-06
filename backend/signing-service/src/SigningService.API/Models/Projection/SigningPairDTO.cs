using System;

namespace SigningService.API.Models.Projection;

public class SigningPairDTO
{
    public int Id { get; set; }
    public string PublicKey { get; set; }
    public byte[] PrivateKey { get; set; }
    public DateTime CreatedOn { get; set; }
    public int? Index { get; set; }
    public string CryptoCode { get; set; }
    public string LabelPartnerCode { get; set; }
}

