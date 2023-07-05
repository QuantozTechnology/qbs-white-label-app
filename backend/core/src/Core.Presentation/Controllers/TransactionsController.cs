// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Queries;
using Core.Presentation.Models;
using Core.Presentation.Models.Requests;
using Core.Presentation.Models.Responses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace Core.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiVersion("1.0")]
    public class TransactionsController : BaseController
    {
        public TransactionsController(ISender sender) : base(sender) { }

        [HttpPost("payments/pay/paymentrequest", Name = "PayPaymentRequest")]
        [ProducesResponseType(typeof(CustomResponse<EmptyCustomResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Transaction.Create")]
        public async Task<IActionResult> CreatePaymentAsync([FromBody] PayPaymentRequestRequest request)
        {
            var command = request.ToCommand(GetUserId(), GetIP());
            await _sender.Send(command);
            return CreatedAtRoute("GetTransactions", null, new EmptyCustomResponse());
        }

        [HttpPost("payments/pay/account", Name = "PayAccount")]
        [ProducesResponseType(typeof(CustomResponse<EmptyCustomResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Transaction.Create")]
        public async Task<IActionResult> CreatePaymentAsync([FromBody] PayAccountRequest request)
        {
            var command = request.ToCommand(GetUserId(), GetIP());
            await _sender.Send(command);
            return CreatedAtRoute("GetTransactions", null, new EmptyCustomResponse());
        }

        [HttpPost("withdraws", Name = "PostWithdraw")]
        [ProducesResponseType(typeof(CustomResponse<EmptyCustomResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Transaction.Create")]
        public async Task<IActionResult> CreateWithdrawAsync([FromBody] CreateWithdrawRequest request)
        {
            var command = request.ToCommand(GetUserId(), GetIP());
            await _sender.Send(command);
            return Created("GetTransactions", new EmptyCustomResponse());
        }


        [HttpGet(Name = "GetTransactions")]
        [ProducesResponseType(typeof(CustomResponse<IEnumerable<TransactionResponse>>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Transaction.Read")]
        public async Task<IActionResult> GetTransactionsAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetPagedTransactionsQuery(GetUserId(), page, pageSize);
            var transactions = await _sender.Send(query);
            var response = ConstructCustomResponse(transactions, TransactionResponse.FromTransaction);
            return Ok(response);
        }

        [HttpGet("withdraws/fees", Name = "GetWithdrawFees")]
        [ProducesResponseType(typeof(CustomResponse<WithdrawFeesResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Transaction.Read")]
        public async Task<IActionResult> GetWithdrawFeesAsync([FromQuery] string tokenCode, [FromQuery] decimal amount)
        {
            var query = new GetWithdrawFeesQuery(GetUserId(), tokenCode, amount);
            var fees = await _sender.Send(query);
            var response = ConstructCustomResponse(fees, WithdrawFeesResponse.FromWithdrawFees);
            return Ok(response);
        }

        [HttpPost("payments/confirm/offer", Name = "ConfirmOfferPayment")]
        [ProducesResponseType(typeof(CustomResponse<EmptyCustomResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Transaction.Create")]
        public async Task<IActionResult> ConfirmOfferPaymentAsync([FromBody] ConfirmOfferRequest request)
        {
            var command = request.ToCommand(GetUserId(), GetIP());
            await _sender.Send(command);
            return CreatedAtRoute("GetTransactions", null, new EmptyCustomResponse());
        }
    }
}