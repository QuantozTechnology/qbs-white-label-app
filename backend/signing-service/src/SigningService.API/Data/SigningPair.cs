using System;

namespace SigningService.API.Data;

public class SigningPair
{
    public int Id { get; set; }
    public string PublicKey { get; set; }
    public DateTime CreatedOn { get; set; }
    public int? Index { get; set; }
    public string CryptoCode { get; set; }
    public string LabelPartnerCode { get; set; }
}
