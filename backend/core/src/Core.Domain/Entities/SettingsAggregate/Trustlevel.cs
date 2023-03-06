namespace Core.Domain.Entities.SettingsAggregate
{

    public class TrustLevel
    {
        public required string Name { get; set; }

        public string? Description { get; set; }

        public required decimal? FundingMothly { get; set; }

        public required decimal? WithdrawMonthly { get; set; }
    }
}
