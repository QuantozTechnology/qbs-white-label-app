using Azure;
using Core.Domain.Entities.SettingsAggregate;
using System.Text.Json.Serialization;

namespace Core.Presentation.Models.Responses.CustomerResponses
{
    public class TrustLevelResponse
    {
        public required string Name { get; set; }

        public string? Description { get; set; }

        public required TrustLevelLimits Limits { get; set; }

        public static TrustLevelResponse FromTrustlevel(TrustLevel trustLevel)
        {
            return new TrustLevelResponse
            {
                Name = trustLevel.Name,
                Description = trustLevel.Description,
                Limits = new TrustLevelLimits()
                {
                    Funding = new FundingLimits
                    {
                        Monthly = trustLevel.FundingMothly
                    },
                    Withdraw = new WithdrawLimits
                    {
                        Monthly = trustLevel.WithdrawMonthly
                    }
                }
            };
        }
    }

    public class TrustLevelLimits
    {
        public FundingLimits? Funding { get; set; }

        public WithdrawLimits? Withdraw { get; set; }
    }

    public class FundingLimits
    {
        public decimal? Monthly { get; set; }
    }

    public class WithdrawLimits
    {
        public decimal? Monthly { get; set; }
    }
}
