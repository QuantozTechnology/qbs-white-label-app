// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using SigningService.API.BLL;
using SigningService.API.Extensions;
using SigningService.API.Models.Requests;
using System;
using System.Threading.Tasks;

namespace SigningService.API.Functions;

public class CreateSigningPair
{
    private readonly ISigningPairLogic _signingPairLogic;

    public CreateSigningPair(
        ISigningPairLogic signingPairLogic)
    {
        _signingPairLogic = signingPairLogic;
    }

    [Function("CreateSigningPair")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "CreateSigningPair")] HttpRequestData req, FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("HttpFunction");
        logger.LogInformation("CreateSigningPair.Run function processed a request at {0}.", DateTime.UtcNow);

        var requestModel = await req.ReadFromJsonAsync<CreateSigningPairModel>();

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
        var newlyCreatedPublicKeyResult = _signingPairLogic.CreateSigningPair(crypto, requestModel.LabelPartnerCode);

        if (newlyCreatedPublicKeyResult.IsFailed)
        {
            return await req.BadRequestAsync("SigningPairCouldNotBeCreated");
        }

        return await req.Ok(newlyCreatedPublicKeyResult.Value);
    }
}
