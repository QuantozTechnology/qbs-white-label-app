using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Web.SDK.Authorization;

namespace Web.Portal
{
    public class AuthorizationProvider : IAuthorizationProvider
    {
        private readonly IAccessTokenProvider _provider;
        private readonly NavigationManager _navigation;

        public AuthorizationProvider(IAccessTokenProvider provider, NavigationManager navigation)
        {
            _provider = provider;
            _navigation = navigation;
        }

        public async Task<string> GetAccessTokenAsync()
        {
            var tokenResult = await _provider.RequestAccessToken();

            if (tokenResult.TryGetToken(out var token))
            {
                var accessToken = token.Value;
                var expiresOn = token.Expires;

                if (!TokenIsValid(accessToken, expiresOn))
                {
                    throw new AccessTokenNotAvailableException(_navigation, tokenResult, Array.Empty<string>());
                }

                return accessToken;
            }
            else
            {
                throw new AccessTokenNotAvailableException(_navigation, tokenResult, Array.Empty<string>());
            }
        }

        private static bool TokenIsValid(string accessToken, DateTimeOffset expiresOn)
        {
            if (string.IsNullOrWhiteSpace(accessToken))
            {
                return false;
            }

            if (DateTimeOffset.UtcNow >= expiresOn)
            {
                return false;
            }

            return true;
        }



    }
}
