namespace Core.Domain
{
    public enum FileType
    {
        IdFront,
        IdBack,
        Passport,
        Selfie
    }

    public enum CustomerStatus
    {
        ACTIVE,
        UNDERREVIEW
    }

    public enum TierType
    {
        Tier1,
        Tier2,
        Tier3
    }

    public enum ComplianceCheckResult
    {
        UsingVPN,
        CountryIsBlacklisted,
        Sanctioned,
        Passed
    }

    public enum DomainErrorCode
    {
        UsingVPNError,
        CountryBlacklistedError,
        CustomerUnderReviewError,
        PropertyRequiredError,
        ExpiredError,
        InvalidStatusError,
        InvalidPropertyError
    }

    public enum PaymentRequestStatus
    {
        Open,
        Paid,
        Processing,
        Cancelled
    }
}
