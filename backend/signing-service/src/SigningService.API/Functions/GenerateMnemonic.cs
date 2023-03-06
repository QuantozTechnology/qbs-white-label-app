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

public class GenerateMnemonic
{
    private readonly ISigningPairLogic _signingPairLogic;

    public GenerateMnemonic(
        ISigningPairLogic signingPairLogic)
    {
        _signingPairLogic = signingPairLogic;
    }

    [FunctionName("GenerateMnemonic")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "GenerateMnemonic")] HttpRequestMessage req,
        ILogger log)
    {
        log.LogInformation("GenerateMnemonic.Run function processed a request at {0}.", DateTime.UtcNow);

        // Convert all request perameter into Json object
        var content = req.Content;

        string jsonContent = await content.ReadAsStringAsync();

        var requestPram = JsonConvert.DeserializeObject<GenerateMnemonicModel>(jsonContent);

        if (string.IsNullOrWhiteSpace(requestPram.Crypto))
        {
            return new BadRequestObjectResult("CryptoCurrencyRequired");
        }

        if (string.IsNullOrWhiteSpace(requestPram.LabelPartnerCode))
        {
            return new BadRequestObjectResult("LabelPartnerRequired");
        }

        // check whether the crypto support tokenization
        if (!(Enum.TryParse<AllowedCryptos>(requestPram.Crypto, true, out var crypto) && Enum.IsDefined(typeof(AllowedCryptos), crypto)))
        {
            return new BadRequestObjectResult("CryptoCurrencyInvalid");
        }

        // generate a keypair and returns public key
        var result = _signingPairLogic.GenerateMnemonic(requestPram);

        if (result.IsFailed)
        {
            return new BadRequestObjectResult(result.Errors);
        }

        return new OkResult();
    }
}
