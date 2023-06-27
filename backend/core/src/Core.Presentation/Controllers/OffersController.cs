// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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

        [HttpPost(Name = "PostOfferRequest")]
        [ProducesResponseType(typeof(CustomResponse<OfferResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("OfferRequest.Create")]
        public async Task<IActionResult> CreateOffersAsync([FromBody] CreateOfferRequest request)
        {
            var command = request.ToCommand(GetUserId());
            var offerRequest = await _sender.Send(command);
            var response = ConstructCustomResponse(offerRequest, OfferResponse.FromOffer);
            return CreatedAtRoute("GetOffersOfCustomer", new { code = offerRequest.OfferCode }, response);
        }

        [HttpGet(Name = "GetOffersOfCustomer")]
        public Task<IActionResult?> GetOffersAsync([FromQuery] string? status, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            // Not implemented yet
            return Task.FromResult<IActionResult>(null);
        }
    }
}