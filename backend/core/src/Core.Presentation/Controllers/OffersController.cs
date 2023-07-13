// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Queries.OfferQueries;
using Core.Application.Queries.PaymentRequestQueries;
using Core.Presentation.Models;
using Core.Presentation.Models.Requests.OfferRequests;
using Core.Presentation.Models.Responses.OfferResponses;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace Core.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiVersion("1.0")]
    public class OffersController : BaseController
    {
        public OffersController(ISender sender) : base(sender)
        {
        }

        [HttpPost(Name = "PostOffer")]
        [ProducesResponseType(typeof(CustomResponse<OfferResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Offer.Create")]
        public async Task<IActionResult> CreateOffersAsync([FromBody] CreateOfferRequest request)
        {
            var command = request.ToCommand(GetUserId());
            var offerRequest = await _sender.Send(command);
            var response = ConstructCustomResponse(offerRequest, OfferResponse.FromOffer);
            return CreatedAtRoute("GetOffersOfCustomer", new { code = offerRequest.OfferCode }, response);
        }

        [HttpGet(Name = "GetOffersOfCustomer")]
        [ProducesResponseType(typeof(CustomResponse<OfferResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Offer.Read")]
        public async Task<IActionResult> GetOffersAsync([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetPagedOffersForCustomerQuery(GetUserId(), status, page, pageSize);
            var offers = await _sender.Send(query);
            var response = ConstructCustomResponse(offers, OfferResponse.FromOffer);
            return Ok(response);
        }

        [HttpGet("{code}", Name = "GetOffer")]
        [ProducesResponseType(typeof(CustomResponse<OfferResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Offer.Read")]
        public async Task<IActionResult> GetOfferAsync([FromRoute] string code)
        {
            var query = new GetOfferQuery(code);
            var offer = await _sender.Send(query);
            var response = ConstructCustomResponse(offer, OfferResponse.FromOffer);
            return Ok(response);
        }
    }
}