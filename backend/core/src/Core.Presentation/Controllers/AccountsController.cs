// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands;
using Core.Application.Queries.AccountQueries;
using Core.Presentation.Models;
using Core.Presentation.Models.Responses.AccountResponses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace Core.Presentation.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class AccountsController : BaseController
    {
        public AccountsController(ISender sender) : base(sender) { }

        [HttpPost(Name = "PostAccount")]
        [ProducesResponseType(typeof(CustomResponse<EmptyCustomResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Account.Create")]
        public async Task<IActionResult> CreateAccountAsync()
        {
            var command = new CreateAccountCommand(GetUserId());
            await _sender.Send(command);
            return CreatedAtRoute("GetAccount", null, new EmptyCustomResponse());
        }

        [HttpGet(Name = "GetAccount")]
        [ProducesResponseType(typeof(CustomResponse<AccountResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Account.Read")]
        public async Task<IActionResult> GetAccountAsync()
        {
            var query = new GetAccountQuery(GetUserId());
            var account = await _sender.Send(query);
            var response = ConstructCustomResponse(account, AccountResponse.FromAccount);
            return Ok(response);
        }

        [HttpGet("balances", Name = "GetAccountBalances")]
        [ProducesResponseType(typeof(CustomResponse<IEnumerable<AccountBalanceResponse>>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Account.Read")]
        public async Task<IActionResult> GetAccountBalancesAsync()
        {
            var query = new GetAccountBalancesQuery(GetUserId());
            var balances = await _sender.Send(query);
            var response = ConstructCustomResponse(balances, AccountBalanceResponse.FromAccountBalance);
            return Ok(response);
        }
    }
}
