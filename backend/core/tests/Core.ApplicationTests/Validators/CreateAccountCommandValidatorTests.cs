// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands;
using Core.Application.Validators.Commands;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Core.ApplicationTests.Validators
{
    [TestClass()]
    public class CreateAccountCommandValidatorTests
    {
        [TestMethod]
        [DataRow(null)]
        [DataRow("")]
        public void Validator_Validates_Create_Account_Command(string customerCode)
        {
            var validator = new CreateAccountCommandValidator();

            var command = new CreateAccountCommand(customerCode);

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
        }

        [TestMethod]
        public void Validator_Validates_Create_Account_Command_With_Valid_CustomerCode()
        {
            var validator = new CreateAccountCommandValidator();

            var command = new CreateAccountCommand("CustomerCode");

            var result = validator.Validate(command);

            Assert.IsTrue(result.IsValid);
        }
    }
}
