// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands;
using Core.Application.Validators.Commands;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Core.ApplicationTests.Validators
{
    [TestClass()]
    public class CreateWithdrawCommandValidatorTests
    {
        [TestMethod]
        [DataRow(null, null, null, null, 0.0)]
        [DataRow("", "", "", "", 0.0)]
        [DataRow("Code123", "Token123", "Memo123", "127.0.0.1", 0.0)]
        public void Validator_Validates_Create_Withdraw_Command(string customerCode, string tokenCode, string memo, string ip, double amount)
        {
            var validator = new CreateWithdrawCommandValidator();

            var command = new CreateWithdrawCommand
            {
                CustomerCode = customerCode,
                TokenCode = tokenCode,
                Memo = memo,
                IP = ip,
                Amount = Convert.ToDecimal(amount)
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
        }

        [TestMethod]
        [DataRow("CustomerCode1", "TokenCode1", "Memo1", "127.0.0.1", 10.50)]
        public void Validator_Validates_Create_Withdraw_Command_Valid_Test(string customerCode, string tokenCode, string memo, string ip, double amount)
        {
            var validator = new CreateWithdrawCommandValidator();

            var command = new CreateWithdrawCommand
            {
                CustomerCode = customerCode,
                TokenCode = tokenCode,
                Memo = memo,
                IP = ip,
                Amount = Convert.ToDecimal(amount)
            };

            var result = validator.Validate(command);

            Assert.IsTrue(result.IsValid);
        }
    }
}
