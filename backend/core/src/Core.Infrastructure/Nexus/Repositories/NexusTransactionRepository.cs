// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using Core.Infrastructure.Nexus.SigningService;
using Nexus.Token.SDK;
using Nexus.Token.SDK.KeyPairs;
using Nexus.Token.SDK.Requests;
using Nexus.Token.SDK.Responses;
using Nexus.Token.SDK.Security;

namespace Core.Infrastructure.Nexus.Repositories
{
    public class NexusTransactionRepository : ITransactionRepository
    {
        private readonly ITokenServer _tokenServer;
        private readonly ISigningService _signingService;
        private readonly IPaymentRepository _paymentRepository;

        private readonly TokenOptions _tokenSettings;

        public NexusTransactionRepository(ITokenServer tokenServer,
            ISigningService signingService,
            IPaymentRepository paymentRepository,
            TokenOptions tokenSettings)
        {
            _tokenServer = tokenServer;
            _signingService = signingService;
            _paymentRepository = paymentRepository;
            _tokenSettings = tokenSettings;
        }

        public async Task<string> CreatePaymentAsync(Payment payment, string? ip = null, CancellationToken cancellationToken = default)
        {
            return _tokenSettings.Blockchain switch
            {
                Blockchain.STELLAR => await CreateStellarPayment(payment, ip),
                Blockchain.ALGORAND => await CreateAlgorandPayment(payment, ip),
                _ => throw new CustomErrorsException("NexusSDKError", _tokenSettings.Blockchain.ToString(), "Blockchain not supported"),
            };
        }

        public async Task<string> CreatePaymentsAsync(Payment[] payments, string? ip = null, CancellationToken cancellationToken = default)
        {
            return _tokenSettings.Blockchain switch
            {
                Blockchain.STELLAR => await CreateStellarPayments(payments, ip),
                //Blockchain.ALGORAND => await CreateAlgorandPayment(payments, ip),
                _ => throw new CustomErrorsException("NexusSDKError", _tokenSettings.Blockchain.ToString(), "Blockchain not supported"),
            };
        }

        public async Task CreateWithdrawAsync(Withdraw withdraw, string? ip = null, CancellationToken cancellationToken = default)
        {
            switch (_tokenSettings.Blockchain)
            {
                case Blockchain.STELLAR:
                    await CreateStellarWithdraw(withdraw, ip);
                    break;

                case Blockchain.ALGORAND:
                    await CreateAlgorandWithdraw(withdraw, ip);
                    break;

                default:
                    throw new CustomErrorsException("NexusSDKError", _tokenSettings.Blockchain.ToString(), "Blockchain not supported");
            }
        }

        public async Task<WithdrawFees> GetWithdrawFeesAsync(Withdraw withdraw, CancellationToken cancellationToken = default)
        {
            var accountCode = Helpers.ToNexusAccountCode(_tokenSettings.Blockchain, withdraw.PublicKey);
            var response = await _tokenServer.Operations.SimulatePayoutAsync(accountCode, withdraw.TokenCode, withdraw.Amount);

            return new WithdrawFees
            {
                RequestedValueFiat = response.Payout.RequestedAmount * response.Payout.ExecutedAmounts.TokenRate,
                Fees = new FeeBreakdown
                {
                    BankFeeFiat = response.Payout.Fees?.BankFeeInFiat,
                    ServiceFeeFiat = response.Payout.Fees?.ServiceFeeInFiat,
                },
                ExecutedValueFiat = response.Payout.ExecutedAmounts.FiatValue
            };
        }

        public async Task<Paged<Transaction>> GetAsync(string publicKey, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            // work around because getting token operations does not support address as account code yet.
            var accountCode = Helpers.ToNexusAccountCode(_tokenSettings.Blockchain, publicKey);
            var account = await _tokenServer.Accounts.Get(accountCode);

            var query = new Dictionary<string, string>
            {
                { "accountCode", account.AccountCode },
                { "page", page.ToString() },
                { "limit", pageSize.ToString() },
            };

            var response = await _tokenServer.Operations.Get(query);

            var operations = response.Records.Where(t => t.Status == "SubmissionCompleted");

            var items = new List<Transaction>();

            foreach (var operation in operations)
            {
                var item = await ConvertToTransactionAsync(publicKey, operation, cancellationToken);
                items.Add(item);
            }

            return new Paged<Transaction>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                Total = response.Total
            };
        }

        #region private methods

        private async Task<string> CreateAlgorandPayment(Payment payment, string? ip = null)
        {
            var rAccountCode = Helpers.ToNexusAccountCode(Blockchain.ALGORAND, payment.ReceiverPublicKey);
            var rBalance = await _tokenServer.Accounts.GetBalances(rAccountCode);

            if (!rBalance.IsConnectedToToken(payment.TokenCode))
            {
                var signableResponse = await _tokenServer.Accounts.ConnectToTokenAsync(rAccountCode, payment.TokenCode);
                var submitRequest = await _signingService.SignAlgorandTransactionAsync(payment.ReceiverPublicKey, signableResponse);

                await _tokenServer.Submit.OnAlgorandAsync(submitRequest);
            }

            {
                var signableResponse = await _tokenServer.Operations
                    .CreatePaymentAsync(
                        payment.SenderPublicKey,
                        payment.ReceiverPublicKey,
                        payment.TokenCode,
                        payment.Amount,
                        payment.Memo,
                        ip
                    );

                var submitRequest = await _signingService.SignAlgorandTransactionAsync(payment.SenderPublicKey, signableResponse);
                await _tokenServer.Submit.OnAlgorandAsync(submitRequest);

                if (signableResponse.TokenOperationResponse?.FirstOrDefault() == null)
                {
                    throw new CustomErrorsException(NexusErrorCodes.TransactionNotFoundError.ToString(), null!, "Transaction not found for the payment request");
                }

                return signableResponse.TokenOperationResponse!.FirstOrDefault()!.Code;
            }
        }

        private async Task<string> CreateStellarPayment(Payment payment, string? ip = null)
        {
            var rAccountCode = Helpers.ToNexusAccountCode(Blockchain.STELLAR, payment.ReceiverPublicKey);
            var rBalance = await _tokenServer.Accounts.GetBalances(rAccountCode);

            if (!rBalance.IsConnectedToToken(payment.TokenCode))
            {
                var signableResponse = await _tokenServer.Accounts.ConnectToTokenAsync(rAccountCode, payment.TokenCode);
                var submitRequest = await _signingService.SignStellarTransactionEnvelopeAsync(payment.ReceiverPublicKey, signableResponse);

                await _tokenServer.Submit.OnStellarAsync(submitRequest);
            }

            {
                var signableResponse = await _tokenServer.Operations
                    .CreatePaymentAsync(
                        payment.SenderPublicKey,
                        payment.ReceiverPublicKey,
                        payment.TokenCode,
                        payment.Amount,
                        payment.Memo,
                        ip
                    );

                var submitRequest = await _signingService.SignStellarTransactionEnvelopeAsync(payment.SenderPublicKey, signableResponse);
                await _tokenServer.Submit.OnStellarAsync(submitRequest);

                if (signableResponse.TokenOperationResponse?.FirstOrDefault() == null)
                {
                    throw new CustomErrorsException(NexusErrorCodes.TransactionNotFoundError.ToString(), null!, "Transaction not found for the payment request");
                }

                return signableResponse.TokenOperationResponse!.FirstOrDefault()!.Code;
            }
        }

        private async Task<string> CreateStellarPayments(Payment[] payments, string? ip = null)
        {
            var paymentDefinitions = payments.Select(payment => new PaymentDefinition
            (
                payment.SenderPublicKey,
                payment.ReceiverPublicKey,
                payment.TokenCode,
                payment.Amount))
                .ToArray();

            var signableResponse = await _tokenServer.Operations.CreatePaymentsAsync(paymentDefinitions);

            ////sign all the token operations inside signableresponse using signing service all together
            //var signedResponses = payments.Select(async x =>
            //{
            //    return await _signingService.SignStellarTransactionEnvelopeAsync(x.SenderPublicKey, signableResponse);
            //})
            //    .ToList();

            var keys = payments.Select(x => x.SenderPublicKey).ToList();
            var signedResponses = await _signingService.SignStellarTransactionEnvelopeAsync(keys, signableResponse);

            await _tokenServer.Submit.OnStellarAsync(signedResponses);

            if (signableResponse.TokenOperationResponse?.FirstOrDefault() == null)
            {
                throw new CustomErrorsException(NexusErrorCodes.TransactionNotFoundError.ToString(), null!, "Transaction not found for the offer request");
            }

            // set transactionCode in payments
            string transactionCode = signableResponse.TokenOperationResponse!.FirstOrDefault()!.Code;

            foreach (var payment in payments)
            {
                payment.TransactionCode = transactionCode;
            }

            return signableResponse.TokenOperationResponse!.FirstOrDefault()!.Code;
        }

        private async Task CreateStellarWithdraw(Withdraw withdraw, string? ip = null)
        {
            var accountCode = Helpers.ToNexusAccountCode(Blockchain.STELLAR, withdraw.PublicKey);

            var signableResponse = await _tokenServer.Operations
                .CreatePayoutAsync(
                    accountCode,
                    withdraw.TokenCode,
                    withdraw.Amount,
                    memo: withdraw.Memo,
                    customerIPAddress: ip
                );

            var submitRequest = await _signingService.SignStellarTransactionEnvelopeAsync(withdraw.PublicKey, signableResponse);
            await _tokenServer.Submit.OnStellarAsync(submitRequest);
        }

        private async Task CreateAlgorandWithdraw(Withdraw withdraw, string? ip = null)
        {
            var accountCode = Helpers.ToNexusAccountCode(Blockchain.ALGORAND, withdraw.PublicKey);

            var signableResponse = await _tokenServer.Operations
                .CreatePayoutAsync(
                    accountCode,
                    withdraw.TokenCode,
                    withdraw.Amount,
                    memo: withdraw.Memo,
                    customerIPAddress: ip
                );

            var submitRequest = await _signingService.SignAlgorandTransactionAsync(withdraw.PublicKey, signableResponse);
            await _tokenServer.Submit.OnAlgorandAsync(submitRequest);
        }

        private async Task<Transaction> ConvertToTransactionAsync(string publicKey, TokenOperationResponse operation, CancellationToken cancellationToken = default)
        {
            var direction = operation.SenderAccount?.PublicKey == publicKey
                ? Direction.Outgoing.ToString()
                : Direction.Incoming.ToString();

            var transaction = new Transaction
            {
                Amount = operation.Amount,
                FromAccountCode = operation.SenderAccount?.AccountCode,
                ToAccountCode = operation.ReceiverAccount?.AccountCode,
                Created = DateTimeOffset.Parse(operation.Created),
                Direction = direction,
                Status = operation.Status,
                TokenCode = operation.TokenCode,
                TransactionCode = operation.Code,
                Memo = operation.Memo,
                Type = operation.Type
            };

            if (transaction.Type == "Payment")
            {
                var hasTransaction = await _paymentRepository.HasTransactionAsync(transaction.TransactionCode, cancellationToken);

                if (hasTransaction)
                {
                    transaction.Payment = await _paymentRepository.GetByTransactionCodeAsync(transaction.TransactionCode, cancellationToken);
                }
            }

            return transaction;
        }
        #endregion
    }
}
