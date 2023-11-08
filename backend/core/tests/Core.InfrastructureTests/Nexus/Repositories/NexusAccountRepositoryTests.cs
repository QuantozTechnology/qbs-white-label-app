// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.AccountAggregate;
using Core.Domain.Exceptions;
using Core.Infrastructure.Nexus;
using Core.Infrastructure.Nexus.Repositories;
using Core.Infrastructure.Nexus.SigningService;
using Core.InfrastructureTests.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Nexus.Sdk.Token;
using Nexus.Sdk.Token.Requests;
using Nexus.Sdk.Token.Responses;

namespace Core.InfrastructureTests.Nexus.Repositories
{
    [TestClass()]
    public class NexusAccountRepositoryTests
    {
        [TestMethod()]
        public async Task Get_Returns_Valid_Account_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            var query = NexusSDKHelper.AccountQuery("TestCustomer");
            var accounts = new AccountResponse[] { NexusSDKHelper.AccountResponse("TestCustomer") };
            server.Setup(s => s.Accounts.Get(query))
                .Returns(Task.FromResult(NexusSDKHelper.PagedResponse(accounts)));

            var signingService = new Mock<ISigningService>();

            var repo = new NexusAccountRepository(signingService.Object, server.Object, DefaultOptions.TokenOptions);

            var account = await repo.GetByCustomerCodeAsync("TestCustomer");

            Assert.AreEqual(NexusSDKHelper.DefaultPublicKey, account.PublicKey);
            Assert.AreEqual("TestCustomer", account.CustomerCode);
        }

        [TestMethod()]
        public async Task Get_Throws_AccountNotFoundError_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            var query = NexusSDKHelper.AccountQuery("TestCustomer");
            server.Setup(s => s.Accounts.Get(query))
                .Returns(Task.FromResult(NexusSDKHelper.EmptyPagedResponse<AccountResponse>()));

            var signingService = new Mock<ISigningService>();

            var repo = new NexusAccountRepository(signingService.Object, server.Object, DefaultOptions.TokenOptions);

            var ex = await Assert.ThrowsExceptionAsync<CustomErrorsException>(async () => await repo.GetByCustomerCodeAsync("TestCustomer"));

            Assert.AreEqual("AccountNotFoundError", ex.CustomErrors.Errors[0].Code);
        }

        [TestMethod()]
        public async Task HasAccount_Returns_False_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            var query = NexusSDKHelper.AccountQuery("TestCustomer");
            server.Setup(s => s.Accounts.Get(query))
                .Returns(Task.FromResult(NexusSDKHelper.EmptyPagedResponse<AccountResponse>()));

            var signingService = new Mock<ISigningService>();

            var repo = new NexusAccountRepository(signingService.Object, server.Object, DefaultOptions.TokenOptions);

            Assert.IsFalse(await repo.HasAccountAsync("TestCustomer"));
        }

        [TestMethod()]
        public async Task HasAccount_Returns_True_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            var query = NexusSDKHelper.AccountQuery("TestCustomer");
            var accounts = new AccountResponse[] { NexusSDKHelper.AccountResponse("TestCustomer") };
            server.Setup(s => s.Accounts.Get(query))
                .Returns(Task.FromResult(NexusSDKHelper.PagedResponse(accounts)));

            var signingService = new Mock<ISigningService>();

            var repo = new NexusAccountRepository(signingService.Object, server.Object, DefaultOptions.TokenOptions);

            var account = await repo.GetByCustomerCodeAsync("TestCustomer");

            Assert.IsTrue(await repo.HasAccountAsync("TestCustomer"));
        }

        [TestMethod()]
        public async Task Create_Creates_Account_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            server.Setup(s => s.Customers.Exists("TestCustomer"))
                .Returns(Task.FromResult(true));
            server.Setup(s => s.Accounts.CreateOnStellarAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<IEnumerable<string>>(), It.IsAny<string>()))
                .Returns(Task.FromResult(NexusSDKHelper.SignableResponse()));
            server.Setup(s => s.Submit.OnStellarAsync(It.IsAny<IEnumerable<StellarSubmitSignatureRequest>>()))
                .Returns(Task.CompletedTask);

            var signingService = new Mock<ISigningService>();
            signingService.Setup(ss => ss.GenerateKeyPair(Blockchain.STELLAR))
                .Returns(Task.FromResult(NexusSDKHelper.DefaultPublicKey));

            var repo = new NexusAccountRepository(signingService.Object, server.Object, DefaultOptions.TokenOptions);

            var account = Account.NewAccount("TestCustomer");
            await repo.CreateAsync(account);

            server.Verify(s => s.Customers.Exists("TestCustomer"), Times.Once());
            server.Verify(s => s.Accounts.CreateOnStellarAsync("TestCustomer", NexusSDKHelper.DefaultPublicKey, new[] { "SCEUR" }, It.IsAny<string>()), Times.Once());
            signingService.Verify(s => s.GenerateKeyPair(Blockchain.STELLAR), Times.Once());
        }

        [TestMethod()]
        public async Task Create_Throws_CustomerNotFoundError_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            server.Setup(s => s.Customers.Exists("TestCustomer"))
                .Returns(Task.FromResult(false));

            var signingService = new Mock<ISigningService>();

            var repo = new NexusAccountRepository(signingService.Object, server.Object, DefaultOptions.TokenOptions);

            var account = Account.NewAccount("TestCustomer");
            var ex = await Assert.ThrowsExceptionAsync<CustomErrorsException>(async () => await repo.CreateAsync(account));

            Assert.AreEqual("CustomerNotFoundError", ex.CustomErrors.Errors[0].Code);

            server.Verify(s => s.Customers.Exists("TestCustomer"), Times.Once());
            server.Verify(s => s.Accounts.CreateOnStellarAsync("TestCustomer", NexusSDKHelper.DefaultPublicKey, It.IsAny<string>()), Times.Never);
            signingService.Verify(s => s.GenerateKeyPair(Blockchain.STELLAR), Times.Never);
        }

        [TestMethod()]
        public async Task Get_Balances_Returns_Balance_TestAsync()
        {
            var server = new Mock<ITokenServer>();
            server.Setup(s => s.Customers.Exists("TestCustomer"))
                .Returns(Task.FromResult(true));
            server.Setup(s => s.Accounts.GetBalances(It.IsAny<string>()))
                .Returns(Task.FromResult(NexusSDKHelper.AccountBalancesResponse()));

            var signingService = new Mock<ISigningService>();

            var repo = new NexusAccountRepository(signingService.Object, server.Object, DefaultOptions.TokenOptions);

            var balances = await repo.GetBalancesAsync(NexusSDKHelper.DefaultPublicKey);

            Assert.AreEqual(1, balances.Count());
            Assert.AreEqual("SCEUR", balances.ElementAt(0).TokenCode);
            Assert.AreEqual(100, balances.ElementAt(0).Balance);
        }
    }
}