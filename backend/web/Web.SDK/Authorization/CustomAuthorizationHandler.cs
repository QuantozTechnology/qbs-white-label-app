using System.Net.Http.Headers;

namespace Web.SDK.Authorization
{
    public class CustomAuthorizationHandler : DelegatingHandler
    {
        private readonly IAuthorizationProvider _provider;

        public CustomAuthorizationHandler(IAuthorizationProvider provider)
        {
            _provider = provider;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var accessToken = await _provider.GetAccessTokenAsync();

            if (!string.IsNullOrWhiteSpace(accessToken))
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
