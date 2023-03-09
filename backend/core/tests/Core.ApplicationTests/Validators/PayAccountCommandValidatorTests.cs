// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands;
using Core.Application.Validators.Commands;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Core.ApplicationTests.Validators
{
    [TestClass()]
    public class PayAccountCommandValidatorTests
    {
        [TestMethod]
        [DataRow(null, null, null, null, 0.0, null, null)]
        [DataRow("", "", "", "", 0.0, null, "")]
        [DataRow("Code123", "ToCode123", "Token123", "Memo123", 0.0, true, "127.0.0.1")]
        public void Validator_Validates_Pay_Account_Command_Test(string customerCode, string toAccountCode, string tokenCode, string memo, double amount, bool? shareName, string ip)
        {
            var validator = new PayAccountCommandValidator();

            var command = new PayAccountCommand
            {
                CustomerCode = customerCode,
                ToAccountCode = toAccountCode,
                TokenCode = tokenCode,
                Memo = memo,
                Amount = Convert.ToDecimal(amount),
                ShareName = shareName,
                IP = ip
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
        }

        [TestMethod]
        [DataRow("Code123", "ToCode123", "Token123", "Memo123", 100.0, true, "127.0.0.1")]
        public void Should_Validate_Pay_Account_Command_With_Valid_Input_Test(string customerCode, string toAccountCode, string tokenCode, string memo, double amount, bool? shareName, string ip)
        {
            var validator = new PayAccountCommandValidator();

            var command = new PayAccountCommand
            {
                CustomerCode = customerCode,
                ToAccountCode = toAccountCode,
                TokenCode = tokenCode,
                Memo = memo,
                Amount = Convert.ToDecimal(amount),
                ShareName = shareName,
                IP = ip
            };

            var result = validator.Validate(command);

            Assert.IsTrue(result.IsValid);
            Assert.AreEqual(0, result.Errors.Count);
        }
    }
}
