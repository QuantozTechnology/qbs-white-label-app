// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Primitives
{
    public class CustomerProperties
    {
        public required string CustomerCode { get; set; }
        public required string Email { get; set; }
        public required string Trustlevel { get; set; }
    }

    public class PrivateCustomerProperties : CustomerProperties
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string DateOfBirth { get; set; }
        public required string CountryOfResidence { get; set; }
        public required string Phone { get; set; }
    }

    public class MerchantCustomerProperties : CustomerProperties
    {
        public required string CompanyName { get; set; }
        public required string ContactPersonFullName { get; set; }
        public required string CountryOfRegistration { get; set; }
    }
}
