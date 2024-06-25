// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Azure.Identity;
using Core.Domain.Exceptions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Graph;

namespace Core.Infrastructure.AzureB2CGraphService
{
    public class B2CGraphService : IB2CGraphService
    {
        private readonly GraphServiceClient _graphServiceClient;
        private readonly ILogger<B2CGraphService> _logger;

        public B2CGraphService(
            GraphServiceClient graphServiceClient,
            IOptions<B2CServiceOptions> options,
            ILogger<B2CGraphService> logger)
        {
            _graphServiceClient = graphServiceClient;
            _logger = logger;

            var clientId = options.Value.ClientId;
            var clientSecret = options.Value.ClientSecret;
            var tenant = options.Value.Tenant;

            var clientSecretCredential = new ClientSecretCredential(tenant, clientId, clientSecret);

            var scopes = new[] { "https://graph.microsoft.com/.default" };

            _graphServiceClient = new GraphServiceClient(clientSecretCredential, scopes);
        }

        public async Task DeleteUserAsync(string customerCode)
        {
            _logger.LogInformation("Attempting to delete user {CustomerId} from B2C.", customerCode);

            try
            {
                var user = await _graphServiceClient.Users[customerCode].GetAsync();

                if (user != null)
                {
                    await _graphServiceClient.Users[customerCode].DeleteAsync();
                    _logger.LogInformation("User {CustomerId} deleted successfully.", customerCode);
                }
                else
                {
                    _logger.LogInformation("User {CustomerId} not found.", customerCode);
                }
            }
            catch (ServiceException ex) when (ex.IsMatch(GraphErrorCode.Request_ResourceNotFound.ToString()))
            {
                _logger.LogInformation("User {CustomerId} not found.", customerCode);
                throw new CustomErrorsException("B2CGraphService", customerCode, "User not found.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while deleting user {CustomerId}.", customerCode);
                throw new CustomErrorsException("B2CGraphService", customerCode, "An unexpected error occurred while deleting user.");
            }
        }
    }
}
