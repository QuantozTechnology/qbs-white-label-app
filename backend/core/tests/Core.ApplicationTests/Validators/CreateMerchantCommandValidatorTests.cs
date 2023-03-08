using Core.Application.Commands.CustomerCommands;
using Core.Application.Validators.Commands.CustomerValidators;
using Core.Application;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Core.ApplicationTests.Validators
{
    [TestClass()]
    public class CreateMerchantCommandValidatorTests
    {
        [TestMethod]
        public void Validator_Validates_CustomerCode_Should_Not_Be_Empty_Test()
        {
            var validator = new CreateMerchantCommandValidator();

            var command = new CreateMerchantCommand
            {
                CustomerCode = "",
                Email = "test@example.com",
                IP = "127.0.0.1",
                ContactPersonFullName = "John Doe",
                CountryOfRegistration = "US",
                CompanyName = "Test Company"
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual(ApplicationErrorCode.InvalidPropertyError.ToString(), result.Errors[0].ErrorCode);
            Assert.AreEqual("CustomerCode", result.Errors[0].PropertyName);
            Assert.AreEqual("'Customer Code' must not be empty.", result.Errors[0].ErrorMessage);
        }

        [TestMethod]
        [DataRow("invalidemail", false, "'Email' is not a valid email address.")]
        [DataRow("validemail@example.com", true, "")]
        public void Validator_Validates_Email_Test(string email, bool expectedIsValid, string expectedErrorMessage)
        {
            var validator = new CreateMerchantCommandValidator();

            var command = new CreateMerchantCommand
            {
                CustomerCode = "TestMerchant",
                Email = email,
                IP = "127.0.0.1",
                ContactPersonFullName = "John Doe",
                CountryOfRegistration = "US",
                CompanyName = "Test Company"
            };

            var result = validator.Validate(command);

            Assert.AreEqual(expectedIsValid, result.IsValid);
            if (!string.IsNullOrEmpty(expectedErrorMessage))
            {
                Assert.AreEqual(ApplicationErrorCode.InvalidPropertyError.ToString(), result.Errors[0].ErrorCode);
                Assert.AreEqual("Email", result.Errors[0].PropertyName);
                Assert.AreEqual(expectedErrorMessage, result.Errors[0].ErrorMessage);
            }
        }

        [TestMethod]
        public void Validator_Validates_IP_Should_Not_Be_Empty_Test()
        {
            var validator = new CreateMerchantCommandValidator();

            var command = new CreateMerchantCommand
            {
                CustomerCode = "TestMerchant",
                Email = "test@example.com",
                IP = "",
                ContactPersonFullName = "John Doe",
                CountryOfRegistration = "US",
                CompanyName = "Test Company"
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual(ApplicationErrorCode.InvalidPropertyError.ToString(), result.Errors[0].ErrorCode);
            Assert.AreEqual("IP", result.Errors[0].PropertyName);
            Assert.AreEqual("'IP' must not be empty.", result.Errors[0].ErrorMessage);
        }

        [TestMethod]
        [DataRow("", "ContactPersonFullName", "'Contact Person Full Name' must not be empty.")]
        [DataRow(null, "ContactPersonFullName", "'Contact Person Full Name' must not be empty.")]
        public void Validator_Validates_ContactPersonFullName_Test(string value, string propertyName, string errorMessage)
        {
            var validator = new CreateMerchantCommandValidator();

            var command = new CreateMerchantCommand
            {
                CustomerCode = "TestMerchant",
                Email = "test@example.com",
                IP = "127.0.0.1",
                ContactPersonFullName = value,
                CountryOfRegistration = "US",
                CompanyName = "Test Company"
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual(ApplicationErrorCode.InvalidPropertyError.ToString(), result.Errors[0].ErrorCode);
            Assert.AreEqual(propertyName, result.Errors[0].PropertyName);
            Assert.AreEqual(errorMessage, result.Errors[0].ErrorMessage);
        }

        [DataTestMethod]
        [DataRow("", "CountryOfRegistration", "'Country Of Registration' must not be empty.")]
        [DataRow(null, "CountryOfRegistration", "'Country Of Registration' must not be empty.")]
        public void Validator_Validates_CountryOfRegistration_Should_Not_Be_Empty_Test(string value, string propertyName, string errorMessage)
        {
            var validator = new CreateMerchantCommandValidator();

            var command = new CreateMerchantCommand
            {
                CustomerCode = "TestMerchant",
                Email = "test@example.com",
                IP = "127.0.0.1",
                ContactPersonFullName = "John Doe",
                CountryOfRegistration = value,
                CompanyName = "Test Company"
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual(ApplicationErrorCode.InvalidPropertyError.ToString(), result.Errors[0].ErrorCode);
            Assert.AreEqual(propertyName, result.Errors[0].PropertyName);
            Assert.AreEqual(errorMessage, result.Errors[0].ErrorMessage);
        }

        [DataTestMethod]
        [DataRow("", "CompanyName", "'Company Name' must not be empty.")]
        [DataRow(null, "CompanyName", "'Company Name' must not be empty.")]
        public void Validator_Validates_CompanyName_Should_Not_Be_Empty_Test(string value, string propertyName, string errorMessage)
        {
            var validator = new CreateMerchantCommandValidator();

            var command = new CreateMerchantCommand
            {
                CustomerCode = "TestMerchant",
                Email = "test@example.com",
                IP = "127.0.0.1",
                ContactPersonFullName = "John Doe",
                CountryOfRegistration = "US",
                CompanyName = value
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.AreEqual(ApplicationErrorCode.InvalidPropertyError.ToString(), result.Errors[0].ErrorCode);
            Assert.AreEqual(propertyName, result.Errors[0].PropertyName);
            Assert.AreEqual(errorMessage, result.Errors[0].ErrorMessage);
        }
    }
}
