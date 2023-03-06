using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SigningService.API.BLL;
using SigningService.API.Models.Requests;

namespace SigningService.API.Functions;

public class CreateSignature
{
    private readonly ISigningPairLogic _signingPairLogic;

    public CreateSignature(
        ISigningPairLogic signingPairLogic)
    {
        _signingPairLogic = signingPairLogic;
    }

    [FunctionName("CreateSignature")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "CreateSignature")] HttpRequestMessage req,
        ILogger log)
    {
        log.LogInformation("CreateSignature.Run function processed a request at {0}.", DateTime.UtcNow);

        // Convert all request perameter into Json object
        var content = req.Content;

        string jsonContent = await content.ReadAsStringAsync();

        var requestModel = JsonConvert.DeserializeObject<CreateSignatureRequestModel>(jsonContent);

        if (string.IsNullOrWhiteSpace(requestModel.Crypto))
        {
            return new BadRequestObjectResult("CryptoCurrencyRequired");
        }

        if (string.IsNullOrWhiteSpace(requestModel.LabelPartnerCode))
        {
            return new BadRequestObjectResult("LabelPartnerRequired");
        }

        if (!requestModel.Signers.Any())
        {
            return new BadRequestObjectResult("SignerRequired");
        }

        if (string.IsNullOrEmpty(requestModel.ToBeSignedTransactionEnvelope))
        {
            return new BadRequestObjectResult("TransactionEnvelopeRequired");
        }

        // check whether the crypto support tokenization
        if (!(Enum.TryParse<AllowedCryptos>(requestModel.Crypto, true, out var crypto) && Enum.IsDefined(typeof(AllowedCryptos), crypto)))
        {
            return new BadRequestObjectResult("CryptoCurrencyInvalid");
        }

        if (crypto == AllowedCryptos.XLM && string.IsNullOrEmpty(requestModel.NetworkPassphrase))
        {
            return new BadRequestObjectResult("NetworkPassphraseRequired");
        }

        var signedTransactionEnvelope = _signingPairLogic.CreateSignature(requestModel);

        if (signedTransactionEnvelope.IsFailed)
        {
            return new BadRequestObjectResult(signedTransactionEnvelope.Errors.FirstOrDefault()?.Message);
        }

        return new OkObjectResult(signedTransactionEnvelope.Value);
    }
}
