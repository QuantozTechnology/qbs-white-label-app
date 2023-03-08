using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using SigningService.API.BLL;
using SigningService.API.Extensions;
using SigningService.API.Models.Requests;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SigningService.API.Functions;

public class GenerateMnemonic
{
    private readonly ISigningPairLogic _signingPairLogic;

    public GenerateMnemonic(
        ISigningPairLogic signingPairLogic)
    {
        _signingPairLogic = signingPairLogic;
    }

    [Function("GenerateMnemonic")]
    public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = "GenerateMnemonic")] HttpRequestData req,
        FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("HttpFunction");
        logger.LogInformation("GenerateMnemonic.Run function processed a request at {0}.", DateTime.UtcNow);

        var requestModel = await req.ReadFromJsonAsync<GenerateMnemonicModel>();

        if (string.IsNullOrWhiteSpace(requestModel.Crypto))
        {
            return await req.BadRequestAsync("CryptoCurrencyRequired");
        }

        if (string.IsNullOrWhiteSpace(requestModel.LabelPartnerCode))
        {
            return await req.BadRequestAsync("LabelPartnerRequired");
        }

        // check whether the crypto support tokenization
        if (!(Enum.TryParse<AllowedCryptos>(requestModel.Crypto, true, out var crypto) && Enum.IsDefined(typeof(AllowedCryptos), crypto)))
        {
            return await req.BadRequestAsync("CryptoCurrencyInvalid");
        }

        // generate a keypair and returns public key
        var result = _signingPairLogic.GenerateMnemonic(requestModel);

        if (result.IsFailed)
        {
            return await req.BadRequestAsync(result.Errors.FirstOrDefault()?.Message);
        }

        return req.Ok();
    }
}
