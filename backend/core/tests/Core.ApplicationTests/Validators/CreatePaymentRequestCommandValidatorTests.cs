// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.PaymentRequestCommands;
using Core.Application.Validators.Commands.PaymentRequestValidators;
using Core.Domain;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Core.ApplicationTests.Validators
{
    [TestClass()]
    public class CreatePaymentRequestCommandValidatorTests
    {
        [TestMethod()]
        [DataRow(0.0, "", "")]
        public void Validator_Validates_PaymentRequest_Without_Options_Test(double amount, string customerCode, string tokenCode)
        {
            var validator = new CreatePaymentRequestCommandValidator();

            var command = new CreatePaymentRequestCommand
            {
                Amount = Convert.ToDecimal(amount),
                CustomerCode = customerCode,
                TokenCode = tokenCode
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual(3, result.Errors.Count);
            Assert.IsTrue(result.Errors.Any(e => e.PropertyName == "Amount"));
            Assert.IsTrue(result.Errors.Any(e => e.PropertyName == "CustomerCode"));
            Assert.IsTrue(result.Errors.Any(e => e.PropertyName == "TokenCode"));
        }

        [TestMethod()]
        [DataRow(0)]
        [DataRow(-1)]
        public void Validator_Validates_ExpiresOn_PaymentRequest_Test(int offset)
        {
            var now = DateTimeOffset.UtcNow;
            using var context = new DateTimeProviderContext(now);

            var validator = new CreatePaymentRequestCommandValidator();

            var command = new CreatePaymentRequestCommand()
            {
                Amount = 100,
                CustomerCode = "TestCustomer",
                TokenCode = "SCEUR",
                ExpiresOn = now.AddHours(offset).ToUnixTimeMilliseconds()
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual(1, result.Errors.Count);
            Assert.IsTrue(result.Errors.Any(e => e.PropertyName == "ExpiresOn"));
        }

        [TestMethod]
        [DataRow(null, true)]
        [DataRow("A", true)]
        [DataRow("This is a memo", true)]
        [DataRow("This is a memo that is longer than 28 characters", false)]
        public void Validator_Validates_Memo_Test(string memo, bool valid)
        {
            var validator = new CreatePaymentRequestCommandValidator();

            var command = new CreatePaymentRequestCommand
            {
                Memo = memo,
                Amount = 100,
                CustomerCode = "TestCustomer",
                TokenCode = "SCEUR",
            };

            var result = validator.Validate(command);

            Assert.AreEqual(valid, result.IsValid);

            if (!valid)
            {
                Assert.AreEqual("Memo", result.Errors[0].PropertyName);
                Assert.AreEqual("'Memo' must be between 1 and 28 characters. You entered 48 characters.", result.Errors[0].ErrorMessage);
            }
        }

        [TestMethod]
        [DataRow("A", true)]
        [DataRow("This is a customer code", true)]
        [DataRow("This is a customer code that is longer than 40 characters", false)]
        public void Validator_Validates_CustomerCode_Length_Test(string customerCode, bool valid)
        {
            var validator = new CreatePaymentRequestCommandValidator();

            var command = new CreatePaymentRequestCommand
            {
                Amount = 100,
                TokenCode = "SCEUR",
                CustomerCode = customerCode
            };

            var result = validator.Validate(command);

            Assert.AreEqual(valid, result.IsValid);
            if (!valid)
            {
                Assert.AreEqual("CustomerCode", result.Errors[0].PropertyName);
                Assert.AreEqual("'Customer Code' must be between 1 and 40 characters. You entered 57 characters.", result.Errors[0].ErrorMessage);
            }
        }

        [TestMethod]
        [DataRow("ThisIsALongTokenCode")]
        public void Validator_Validates_TokenCode_Length_Test(string tokenCode)
        {
            var validator = new CreatePaymentRequestCommandValidator();

            var command = new CreatePaymentRequestCommand
            {
                Amount = 100,
                TokenCode = tokenCode,
                CustomerCode = "TestCustomer"
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual("TokenCode", result.Errors[0].PropertyName);
            Assert.AreEqual("'Token Code' must be between 1 and 12 characters. You entered 20 characters.", result.Errors[0].ErrorMessage);
        }

        [TestMethod]
        [DataRow(0.0, "SCEUR", "TestCustomer")]
        [DataRow(-100.0, "SCEUR", "TestCustomer")]
        public void Validator_Validates_Amount_Test(double amount, string tokenCode, string customerCode)
        {
            var validator = new CreatePaymentRequestCommandValidator();

            var command = new CreatePaymentRequestCommand
            {
                Amount = Convert.ToDecimal(amount),
                TokenCode = tokenCode,
                CustomerCode = customerCode
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual("Amount", result.Errors[0].PropertyName);
            Assert.AreEqual("'Amount' must be greater than '0'.", result.Errors[0].ErrorMessage);
        }

        [TestMethod]
        [DataRow("", "'Params Keys' must not be empty.")]
        [DataRow("  ", "'Params Keys' must not be empty.")]
        [DataRow("This is a key that is longer than 50 characters check this", "'Params Keys' must be between 1 and 50 characters. You entered 58 characters.")]
        public void Validator_Validates_Params_Keys_Test(string key, string expectedErrorMessage)
        {
            var validator = new CreatePaymentRequestCommandValidator();

            var command = new CreatePaymentRequestCommand
            {
                Amount = 100,
                TokenCode = "SCEUR",
                CustomerCode = "TestCustomer",
                Params = new Dictionary<string, string> { { key, "value" } }
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);

            Assert.AreEqual("Params.Keys[0]", result.Errors[0].PropertyName);
            Assert.AreEqual(expectedErrorMessage, result.Errors[0].ErrorMessage);
        }

        [TestMethod]
        [DataRow("", "'Params Values' must not be empty.")]
        [DataRow("  ", "'Params Values' must not be empty.")]
        [DataRow("This is a value that is longer than 50 characters check this", "'Params Values' must be between 1 and 50 characters. You entered 60 characters.")]
        public void Validator_Validates_Params_Values_Test(string value, string expectedErrorMessage)
        {
            var validator = new CreatePaymentRequestCommandValidator();

            var command = new CreatePaymentRequestCommand
            {
                Amount = 100,
                TokenCode = "SCEUR",
                CustomerCode = "TestCustomer",
                Params = new Dictionary<string, string> { { "key", value } }
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual("Params.Values[0]", result.Errors[0].PropertyName);
            Assert.AreEqual(expectedErrorMessage, result.Errors[0].ErrorMessage);
        }
    }
}