namespace SigningService.API.Models.Requests;

public class GenerateMnemonicModel
{
    public string Crypto { get; set; }
    public string LabelPartnerCode { get; set; }
}
