// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.PaymentRequestCommands;
using Core.Application.Queries.PaymentRequestQueries;
using Core.Presentation.Models;
using Core.Presentation.Models.Requests;
using Core.Presentation.Models.Responses.PaymentRequestResponses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace Core.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiVersion("1.0")]
    public class PaymentRequestsController : BaseController
    {
        public PaymentRequestsController(ISender sender) : base(sender) { }

        [HttpPost(Name = "PostPaymentRequest")]
        [ProducesResponseType(typeof(CustomResponse<PaymentRequestResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("PaymentRequest.Create")]
        public async Task<IActionResult> CreatePaymentRequestAsync([FromBody] CreatePaymentRequestRequest request)
        {
            var command = request.ToCommand(GetUserId());
            var paymentRequest = await _sender.Send(command);
            var response = ConstructCustomResponse(paymentRequest, PaymentRequestResponse.FromPaymentRequest);
            return CreatedAtRoute("GetPaymentRequestsOfCustomer", new { code = paymentRequest.Code }, response);
        }

        [HttpPut("{code}/cancel", Name = "CancelPaymentRequest")]
        [ProducesResponseType(typeof(CustomResponse<EmptyCustomResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("PaymentRequest.Create")]
        public async Task<IActionResult> CancelPaymentRequestAsync([FromRoute] string code)
        {
            var command = new CancelPaymentRequestCommand(GetUserId(), code);
            await _sender.Send(command);
            return Ok(new EmptyCustomResponse());
        }

        [HttpGet("{code}", Name = "GetPaymentRequest")]
        [ProducesResponseType(typeof(CustomResponse<PaymentRequestResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("PaymentRequest.Read")]
        public async Task<IActionResult> GetPaymentRequestAsync([FromRoute] string code)
        {
            var query = new GetPaymentRequestQuery(code);
            var paymentRequest = await _sender.Send(query);
            var response = ConstructCustomResponse(paymentRequest, PaymentRequestResponse.FromPaymentRequest);
            return Ok(response);
        }

        [HttpGet(Name = "GetPaymentRequestsOfCustomer")]
        [ProducesResponseType(typeof(CustomResponse<PaymentRequestResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("PaymentRequest.Read")]
        public async Task<IActionResult> GetPaymentRequestsAsync([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetPagedPaymentRequestsForCustomerQuery(GetUserId(), status, page, pageSize);
            var paymentRequest = await _sender.Send(query);
            var response = ConstructCustomResponse(paymentRequest, PaymentRequestResponse.FromPaymentRequest);
            return Ok(response);
        }

        [HttpPost("merchant", Name = "PostMerchantPaymentRequest")]
        [ProducesResponseType(typeof(CustomResponse<MerchantPaymentRequestResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("PaymentRequest.Merchant.Create")]
        public async Task<IActionResult> CreateMerchantPaymentRequestAsync([FromBody] CreateMerchantPaymentRequestRequest request)
        {
            var command = request.ToCommand(GetUserId());
            var paymentRequest = await _sender.Send(command);
            var response = ConstructCustomResponse(paymentRequest, MerchantPaymentRequestResponse.FromPaymentRequest);
            return CreatedAtRoute("GetMerchantPaymentRequest", new { code = paymentRequest.Code }, response);
        }

        [HttpGet("merchant/{code}", Name = "GetMerchantPaymentRequest")]
        [ProducesResponseType(typeof(CustomResponse<MerchantPaymentRequestResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [AllowAnonymous]
        public async Task<IActionResult> GetMerchantPaymentRequestAsync([FromRoute] string code)
        {
            var query = new GetMerchantPaymentRequestQuery(code);
            var paymentRequest = await _sender.Send(query);
            var response = ConstructCustomResponse(paymentRequest, MerchantPaymentRequestResponse.FromPaymentRequest);
            return Ok(response);
        }
    }
}
