// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
        InvalidPropertyError,
        SecurityCheckError
    }

    public enum PaymentRequestStatus
    {
        Open,
        Paid,
        Processing,
        Cancelled,
        Expired
    }
}
