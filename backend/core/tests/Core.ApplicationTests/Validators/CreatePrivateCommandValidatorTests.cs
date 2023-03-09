// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.CustomerCommands;
using Core.Application.Validators.Commands.CustomerValidators;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Core.ApplicationTests.Validators
{
    [TestClass()]
    public class CreatePrivateCommandValidatorTests
    {
        [TestMethod]
        [DataRow(null, "TestEmail@gmail.com", "127.0.0.1", "John", "Doe", "1980-01-01", "US", "+1234567890")]
        [DataRow("TestCode", null, "127.0.0.1", "John", "Doe", "1980-01-01", "US", "+1234567890")]
        [DataRow("TestCode", "InvalidEmail", "127.0.0.1", "John", "Doe", "1980-01-01", "US", "+1234567890")]
        [DataRow("TestCode", "TestEmail@gmail.com", null, "John", "Doe", "1980-01-01", "US", "+1234567890")]
        [DataRow("TestCode", "TestEmail@gmail.com", "127.0.0.1", null, "Doe", "1980-01-01", "US", "+1234567890")]
        [DataRow("TestCode", "TestEmail@gmail.com", "127.0.0.1", "John", null, "1980-01-01", "US", "+1234567890")]
        [DataRow("TestCode", "TestEmail@gmail.com", "127.0.0.1", "John", "Doe", null, "US", "+1234567890")]
        [DataRow("TestCode", "TestEmail@gmail.com", "127.0.0.1", "John", "Doe", "1980-01-01", null, "+1234567890")]
        [DataRow("TestCode", "TestEmail@gmail.com", "127.0.0.1", "John", "Doe", "1980-01-01", "US", null)]
        public void Should_Validate_Private_Command(string customerCode, string email, string ip, string firstName, string lastName, string dateOfBirth, string countryOfResidence, string phone)
        {
            var validator = new CreatePrivateCommandValidator();

            var command = new CreatePrivateCommand
            {
                CustomerCode = customerCode,
                Email = email,
                IP = ip,
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                CountryOfResidence = countryOfResidence,
                Phone = phone
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.IsTrue(result.Errors.Any());
        }


    }
}
