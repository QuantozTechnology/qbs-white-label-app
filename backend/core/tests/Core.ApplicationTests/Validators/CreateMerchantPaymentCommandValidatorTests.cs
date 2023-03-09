// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.PaymentRequestCommands;
using Core.Application.Validators.Commands.PaymentRequestValidators;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Core.ApplicationTests.Validators
{
    [TestClass()]
    public class CreateMerchantPaymentCommandValidatorTests
    {
        [TestMethod()]
        [DataRow("")]
        [DataRow("  ")]
        public void Validator_Validates_ReturnUrl_Empty_Test(string url)
        {
            var validator = new CreateMerchantPaymentCommandValidator();

            var command = new CreateMerchantPaymentRequestCommand 
            {
                Amount = 100,
                CustomerCode = "TestMerchant",
                TokenCode = "SCEUR",
                CallbackUrl = null,
                ReturnUrl = url 
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual("ReturnUrl", result.Errors[0].PropertyName);
            Assert.AreEqual("'Return Url' must not be empty.", result.Errors[0].ErrorMessage);
        }

        [TestMethod()]
        [DataRow("This is a url that is longer than 100 characters This is a url that is longer than 100 characters This is a url that is longer than 100 characters This is a url that is longer than 100 characters This is a url that is longer than 100 characters")]
        public void Validator_Validates_ReturnUrl_Characters_Test(string url)
        {
            var validator = new CreateMerchantPaymentCommandValidator();

            var command = new CreateMerchantPaymentRequestCommand 
            {
                Amount = 100,
                CustomerCode = "TestMerchant",
                TokenCode = "SCEUR",
                CallbackUrl = null,
                ReturnUrl = url 
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual("ReturnUrl", result.Errors[0].PropertyName);
            Assert.AreEqual("'Return Url' must be between 1 and 100 characters. You entered 244 characters.", result.Errors[0].ErrorMessage);
        }

        [TestMethod()]
        [DataRow("This is a CallbackUrl that is longer than 100 characters")]
        public void Validator_Validates_CallbackUrl_Characters_Test(string callbackUrl)
        {
            var validator = new CreateMerchantPaymentCommandValidator();
            var command = new CreateMerchantPaymentRequestCommand
            {
                Amount = 100,
                CustomerCode = "TestMerchant",
                TokenCode = "SCEUR",
                Params = new Dictionary<string, string> { { "key", "value" } },
                ReturnUrl = "https://example.com/return",
                CallbackUrl = callbackUrl
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual("CallbackUrl", result.Errors[0].PropertyName);
            Assert.AreEqual("The provided URL is invalid", result.Errors[0].ErrorMessage);
        }

        [TestMethod()]
        [DataRow("invalid-url")]
        public void Validator_Validates_ReturnUrl_Uri_Test(string returnUrl)
        {
            var validator = new CreateMerchantPaymentCommandValidator();
            var command = new CreateMerchantPaymentRequestCommand
            {
                Amount = 100,
                CustomerCode = "TestMerchant",
                TokenCode = "SCEUR",
                Params = new Dictionary<string, string> { { "key", "value" } },
                ReturnUrl = returnUrl,
                CallbackUrl = null
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual("ReturnUrl", result.Errors[0].PropertyName);
            Assert.AreEqual("The provided URL is invalid", result.Errors[0].ErrorMessage);
        }

        [TestMethod]
        [DataRow("http://www.example.com")]
        [DataRow("https://www.example.com")]
        [DataRow(null)]
        public void CallbackUrl_Should_Be_Valid_Uri_Or_Optional(string url)
        {
            var validator = new CreateMerchantPaymentCommandValidator();

            var command = new CreateMerchantPaymentRequestCommand
            {
                Amount = 100,
                CustomerCode = "TestMerchant",
                TokenCode = "SCEUR",
                ReturnUrl = "https://www.example.com/success",
                CallbackUrl = url
            };

            var result = validator.Validate(command);

            if (string.IsNullOrWhiteSpace(url))
            {
                Assert.IsTrue(result.IsValid);
            }
            else
            {
                Assert.IsFalse(result.Errors.Any(e => e.PropertyName == "CallbackUrl" && e.ErrorMessage == "The provided URL is invalid"));
                if (url.Length > 100)
                {
                    Assert.IsFalse(result.IsValid);
                    Assert.AreEqual("CallbackUrl", result.Errors[0].PropertyName);
                    Assert.AreEqual("'CallbackUrl' must be between 1 and 100 characters. You entered " + url.Length + " characters.", result.Errors[0].ErrorMessage);
                }
                else
                {
                    Assert.IsTrue(result.IsValid);
                }
            }
        }

        [TestMethod]
        [DataRow("invalidUrl")]
        public void CallbackUrl_Should_Be_Invalid_Uri(string url)
        {
            var validator = new CreateMerchantPaymentCommandValidator();

            var command = new CreateMerchantPaymentRequestCommand
            {
                Amount = 100,
                CustomerCode = "TestMerchant",
                TokenCode = "SCEUR",
                ReturnUrl = "https://www.example.com/success",
                CallbackUrl = url 
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual("CallbackUrl", result.Errors[0].PropertyName);
            Assert.AreEqual("The provided URL is invalid", result.Errors[0].ErrorMessage);
        }

    }
}
