// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Infrastructure.Nexus
{
    public static class Constants
    {
        public static class PersonalData
        {
            public const string DateOfBirth = "DateOfBirth";
            public const string FirstName = "FirstName";
            public const string LastName = "LastName";
            public const string Phone = "Phone";
            public const string CountryOfResidence = "CountryOfResidence";
        }

        public static class NexusErrorMessages
        {
            public const string CustomerNotFound = "There is no customer with this customer code";
            public const string AccountNotFound = "There is no account for this customer";
            public const string ExistingProperty = "A customer with this code already exists";
        }
    }
}
