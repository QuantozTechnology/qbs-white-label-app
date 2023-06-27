// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.OfferCommands;

namespace Core.Presentation.Models.Requests.OfferRequests
{
    public class CreateOfferRequest
    {
        public required string Action { get; set; }

        public required OfferRequestToken SourceToken { get; set; }

        public required OfferRequestToken DestinationToken { get; set; }

        public required decimal PricePerUnit { get; set; }

        public OptionsRequest? Options { get; set; }

        public string? OfferCode { get; set; }

        public CreateOfferRequestCommand ToCommand(string customerCode)
        {
            return new CreateOfferRequestCommand
            {
                CustomerCode = customerCode,
                SourceTokenCode = SourceToken.TokenCode,
                SourceTokenAmount = SourceToken.Amount,
                DestinationTokenCode = DestinationToken.TokenCode,
                DestinationTokenAmount = DestinationToken.Amount,
                PricePerUnit = PricePerUnit,
                OfferAction = Action,
                Memo = Options?.Memo,
                ExpiresOn = Options?.ExpiresOn,
                ShareName = Options?.ShareName,
                IsOneOffPayment = Options?.IsOneOffPayment,
                PayerCanChangeRequestedAmount = Options?.PayerCanChangeRequestedAmount,
                Params = Options?.Params,
                OfferCode = OfferCode
            };
        }
    }

    public class OfferRequestToken
    {
        public required string TokenCode { get; set; }
        public required decimal Amount { get; set; }
    }
}