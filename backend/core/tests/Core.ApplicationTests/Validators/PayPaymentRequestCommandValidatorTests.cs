// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application;
using Core.Application.Commands;
using Core.Application.Validators.Commands;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Core.ApplicationTests.Validators
{
    [TestClass()]
    public class PayPaymentRequestCommandValidatorTests
    {
        [TestMethod]
        [DataRow(null, null, 0.0, null)]
        [DataRow("Code123", "Code123", 0.0, "127.1.1")]
        public void Validator_Validates_Pay_Payment_Request_Command_Test(string customerCode, string paymentRequestCode, double amount, string ip)
        {
            var validator = new PayPaymentRequestCommandValidator();

            var command = new PayPaymentRequestCommand
            {
                CustomerCode = customerCode,
                PaymentRequestCode = paymentRequestCode,
                Amount = Convert.ToDecimal(amount),
                IP = ip
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);

            var errorCodes = result.Errors.Select(e => e.ErrorCode).ToList();
            Assert.IsTrue(errorCodes.Contains(ApplicationErrorCode.InvalidPropertyError.ToString()));
        }

        [TestMethod]
        [DataRow("Code123", "RequestCode123", 100.00, "127.0.0")]
        public void Validator_Validates_Valid_Pay_Payment_Request_Command_Test(string customerCode, string paymentRequestCode, double amount, string ip)
        {
            var validator = new PayPaymentRequestCommandValidator();

            var command = new PayPaymentRequestCommand
            {
                CustomerCode = customerCode,
                PaymentRequestCode = paymentRequestCode,
                Amount = Convert.ToDecimal(amount),
                IP = ip
            };

            var result = validator.Validate(command);

            Assert.IsTrue(result.IsValid);
            Assert.AreEqual(0, result.Errors.Count);
        }
    }
}
