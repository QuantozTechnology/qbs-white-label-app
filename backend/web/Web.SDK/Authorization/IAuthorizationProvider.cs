namespace Web.SDK.Authorization
{
    public interface IAuthorizationProvider
    {
        public Task<string> GetAccessTokenAsync();
    }
}
