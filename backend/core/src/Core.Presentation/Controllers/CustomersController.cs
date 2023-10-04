// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Queries.CustomerQueries;
using Core.Presentation.Models;
using Core.Presentation.Models.Requests.CustomerRequests;
using Core.Presentation.Models.Responses.CustomerResponses;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace Core.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiVersion("1.0")]
    public class CustomersController : BaseController
    {
        public CustomersController(ISender sender) : base(sender)
        {
        }

        [HttpPost(Name = "PostCustomer")]
        [ProducesResponseType(typeof(CustomResponse<EmptyCustomResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Customer.Create")]
        public async Task<IActionResult> CreateCustomerAsync([FromBody] CreatePrivateRequest request)
        {
            var command = request.ToCommand(GetUserId(), GetIP());
            await _sender.Send(command);
            return CreatedAtRoute("GetCustomer", null, new EmptyCustomResponse());
        }

        [HttpPost("merchant", Name = "PostMerchantCustomer")]
        [ProducesResponseType(typeof(CustomResponse<EmptyCustomResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Customer.Merchant.Create")]
        public async Task<IActionResult> CreateMerchantAsync([FromBody] CreateMerchantRequest request)
        {
            var command = request.ToCommand(GetUserId(), GetIP());
            await _sender.Send(command);
            return CreatedAtRoute("GetCustomer", null, new EmptyCustomResponse());
        }

        [HttpPost("files/{fileType}", Name = "UploadCustomerFiles")]
        [ProducesResponseType(typeof(CustomResponse<EmptyCustomResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Customer.File.Create")]
        public async Task<IActionResult> UploadCustomerFilesAsync([FromForm] UploadCustomerFileRequest request, [FromRoute] string fileType)
        {
            var command = request.ToCommand(GetUserId(), fileType);
            await _sender.Send(command);
            return CreatedAtRoute("GetCustomer", null, new EmptyCustomResponse());
        }

        [HttpGet(Name = "GetCustomer")]
        [ProducesResponseType(typeof(CustomResponse<CustomerResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Customer.Read")]
        public async Task<IActionResult> GetCustomerAsync()
        {
            var query = new GetCustomerQuery(GetUserId());
            var customer = await _sender.Send(query);
            var response = ConstructCustomResponse(customer, CustomerResponse.FromCustomer);
            return Ok(response);
        }

        [HttpGet("limits", Name = "GetCustomerLimits")]
        [ProducesResponseType(typeof(CustomResponse<IEnumerable<CustomerLimitResponse>>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Customer.Read")]
        public async Task<IActionResult> GetCustomerTokenLimitsAsync()
        {
            var query = new GetCustomerLimitsQuery(GetUserId());
            var customerLimits = await _sender.Send(query);
            var response = ConstructCustomResponse(customerLimits, CustomerLimitResponse.FromCustomerLimit);
            return Ok(response);
        }

        [HttpPost("devices", Name = "DeviceAuthentication")]
        [ProducesResponseType(typeof(CustomResponse<DeviceAuthenticationResponse>), 201)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 400)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 409)]
        [RequiredScope("Customer.Create")]
        public async Task<IActionResult> DeviceAuthenticationAsync([FromBody] CreateDeviceAuthenticationRequest request)
        {
            var command = request.ToCommand(GetUserId(), GetIP());
            var result = await _sender.Send(command);
            var response = ConstructCustomResponse(result, DeviceAuthenticationResponse.FromOTPKey);
            return Ok(response);
        }
    }
}
