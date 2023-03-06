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
        [DataRow(-100.0, null, null)]
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

        [TestMethod()]
        public void Validator_Validates_Memo_PaymentRequest_Test()
        {
            var validator = new CreatePaymentRequestCommandValidator();

            var command = new CreatePaymentRequestCommand()
            {
                Amount = 100,
                CustomerCode = "TestCustomer",
                TokenCode = "SCEUR",
                Memo = ""
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual(1, result.Errors.Count);
            Assert.IsTrue(result.Errors.Any(e => e.PropertyName == "Memo"));
        }
    }
}