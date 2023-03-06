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
