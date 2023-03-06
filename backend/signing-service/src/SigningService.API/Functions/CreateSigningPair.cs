using System;
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

public class CreateSigningPair
{
    private readonly ISigningPairLogic _signingPairLogic;

    public CreateSigningPair(
        ISigningPairLogic signingPairLogic)
    {
        _signingPairLogic = signingPairLogic;
    }

    [FunctionName("CreateSigningPair")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "CreateSigningPair")] HttpRequestMessage req,
        ILogger log)
    {
        log.LogInformation("CreateSigningPair.Run function processed a request at {0}.", DateTime.UtcNow);

        // Convert all request perameter into Json object
        var content = req.Content;

        string jsonContent = await content.ReadAsStringAsync();

        var requestModel = JsonConvert.DeserializeObject<CreateSigningPairModel>(jsonContent);

        if (string.IsNullOrWhiteSpace(requestModel.Crypto))
        {
            return new BadRequestObjectResult("CryptoCurrencyRequired");
        }

        if (string.IsNullOrWhiteSpace(requestModel.LabelPartnerCode))
        {
            return new BadRequestObjectResult("LabelPartnerRequired");
        }

        // check whether the crypto support tokenization
        if (!(Enum.TryParse<AllowedCryptos>(requestModel.Crypto, true, out var crypto) && Enum.IsDefined(typeof(AllowedCryptos), crypto)))
        {
            return new BadRequestObjectResult("CryptoCurrencyInvalid");
        }

        // generate a keypair and returns public key
        var newlyCreatedPublicKeyResult = _signingPairLogic.CreateSigningPair(crypto, requestModel.LabelPartnerCode);

        if (newlyCreatedPublicKeyResult.IsFailed)
        {
            return new BadRequestObjectResult("SigningPairCouldNotBeCreated");
        }

        return new OkObjectResult(newlyCreatedPublicKeyResult.Value);
    }
}
