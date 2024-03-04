// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Exceptions;
using Core.Infrastructure.Nexus.Repositories;
using Core.InfrastructureTests.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Nexus.Sdk.Shared.Requests;
using Nexus.Sdk.Token;

namespace Core.InfrastructureTests.Nexus.Repositories
{
    [TestClass()]
    public class NexusCustomerRepositoryTests
    {
        [TestMethod()]
        public async Task CreateCustomer_Creates_Customer_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            server.Setup(s => s.Customers.Exists("TestCustomer"))
                .Returns(Task.FromResult(false));
            server.Setup(s => s.Customers.Create(It.IsAny<CreateCustomerRequest>(), It.IsAny<string>()))
                .Returns(Task.FromResult(NexusSDKHelper.PrivateCustomer("TestCustomer")));

            var repo = new NexusCustomerRepository(server.Object, DefaultOptions.TokenOptions);

            var customer = new Customer()
            {
                CustomerCode = "TestCustomer",
                CurrencyCode = "EUR",
                Email = "test@test.com",
                IsMerchant = false,
                Status = "ACTIVE",
                TrustLevel = "PTrusted",
                BankAccount = string.Empty,
                Data = new Dictionary<string, string>
                {
                    { "FirstName", "Hans"},
                    { "LastName", "Peter"}
                }
            };

            await repo.CreateAsync(customer);

            var expected = new CreateCustomerRequest
            {
                CustomerCode = "TestCustomer",
                CurrencyCode = "EUR",
                Email = "test@test.com",
                IsBusiness = false,
                Status = "ACTIVE",
                TrustLevel = "PTrusted",
                Data = new Dictionary<string, string>
                {
                    { "FirstName", "Hans"},
                    { "LastName", "Peter"}
                }
            };

            server.Verify(s => s.Customers.Create(It.Is<CreateCustomerRequest>(
                actual => NexusSDKHelper.AreEqual(expected, actual)), It.IsAny<string>()), Times.Once);
        }

        [TestMethod()]
        public async Task CreateCustomer_Creates_Business_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            server.Setup(s => s.Customers.Exists("TestCustomer"))
                .Returns(Task.FromResult(false));
            server.Setup(s => s.Customers.Create(It.IsAny<CreateCustomerRequest>(), It.IsAny<string>()))
                .Returns(Task.FromResult(NexusSDKHelper.PrivateCustomer("TestCustomer")));

            var customer = new Customer()
            {
                CustomerCode = "TestCustomer",
                CurrencyCode = "EUR",
                Email = "test@test.com",
                IsMerchant = true,
                Status = "ACTIVE",
                TrustLevel = "BTrusted",
                BankAccount = string.Empty,
                Data = new Dictionary<string, string>
                {
                    { "CompanyName", "Hans"},
                    { "Key2", "Value2"}
                }
            };

            var repo = new NexusCustomerRepository(server.Object, DefaultOptions.TokenOptions);
            await repo.CreateAsync(customer);

            var expected = new CreateCustomerRequest
            {
                CustomerCode = "TestCustomer",
                CurrencyCode = "EUR",
                Email = "test@test.com",
                IsBusiness = true,
                Status = "ACTIVE",
                TrustLevel = "BTrusted", // if business is true we use a different a trust level
                Data = new Dictionary<string, string>
                {
                    { "CompanyName", "Hans"},
                    { "Key2", "Value2"}
                }
            };

            server.Verify(s => s.Customers.Create(It.Is<CreateCustomerRequest>(
                actual => NexusSDKHelper.AreEqual(expected, actual)), It.IsAny<string>()), Times.Once);
        }

        [TestMethod()]
        public async Task CreateCustomer_Creating_Throws_ExistsPropertyError_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            server.Setup(s => s.Customers.Exists("TestCustomer"))
                .Returns(Task.FromResult(true));

            var repo = new NexusCustomerRepository(server.Object, DefaultOptions.TokenOptions);

            var customer = new Customer()
            {
                CustomerCode = "TestCustomer",
                CurrencyCode = string.Empty,
                Email = "test@test.com",
                IsMerchant = false,
                Status = "ACTIVE",
                TrustLevel = string.Empty,
                BankAccount = string.Empty,
                Data = new Dictionary<string, string>
                {
                    { "Key1", "Value1"},
                    { "Key2", "Value2"}
                }
            };

            var ex = await Assert.ThrowsExceptionAsync<CustomErrorsException>(async () => await repo.CreateAsync(customer));

            Assert.AreEqual("ExistingProperty", ex.CustomErrors.Errors[0].Code);

            server.Verify(s => s.Customers.Exists("TestCustomer"), Times.Once());
            server.Verify(s => s.Customers.Create(It.IsAny<CreateCustomerRequest>(), It.IsAny<string>()), Times.Never);
        }

        public async static Task Get_Returns_Valid_Customer_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            server.Setup(s => s.Customers.Exists("TestCustomer"))
               .Returns(Task.FromResult(true));
            server.Setup(s => s.Customers.Get("TestCustomer"))
                .Returns(Task.FromResult(NexusSDKHelper.PrivateCustomer("TestCustomer")));

            var repo = new NexusCustomerRepository(server.Object, DefaultOptions.TokenOptions);

            var customer = await repo.GetAsync("TestCustomer");

            Assert.AreEqual("TestCustomer", customer.CustomerCode);
            Assert.AreEqual("test@test.com", customer.Email);
            Assert.IsFalse(customer.IsMerchant);
            Assert.AreEqual("PTrusted", customer.TrustLevel);
            Assert.AreEqual("ACTIVE", customer.Status);
            Assert.AreEqual("EUR", customer.CurrencyCode);
            Assert.AreEqual(0, customer.Data.Count);
        }
    }
}