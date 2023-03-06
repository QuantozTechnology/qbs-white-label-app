namespace Core.Infrastructure.Compliance.Sanctionlist
{
    public interface ISanctionlist
    {
        public Task<bool> IsPersonSanctioned(string customerCode, string name);

        public Task<bool> IsEnterpriseSanctioned(string customerCode, string name);
    }
}
