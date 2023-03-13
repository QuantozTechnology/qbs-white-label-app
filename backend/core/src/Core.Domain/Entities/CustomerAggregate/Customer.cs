// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.AccountAggregate;
using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Primitives;

namespace Core.Domain.Entities.CustomerAggregate
{
    public class Customer
    {
        public required string CustomerCode { get; set; }
        public required string Email { get; set; }
        public required string CurrencyCode { get; set; }
        public required string Status { get; set; }
        public required string TrustLevel { get; set; }
        public string? BankAccount { get; set; }
        public required bool IsMerchant { get; set; }
        public required IDictionary<string, string> Data { get; set; }
        public string? UpdateReason { get; set; }

        public Customer() { }

        public static Customer NewPrivateCustomer(PrivateCustomerProperties properties)
        {
            var data = new Dictionary<string, string>
            {
                { Constants.PrivateCustomerPersonalData.FirstName, properties.FirstName },
                { Constants.PrivateCustomerPersonalData.LastName, properties.LastName },
                { Constants.PrivateCustomerPersonalData.DateOfBirth, properties.DateOfBirth },
                { Constants.PrivateCustomerPersonalData.Phone, properties.Phone },
                { Constants.PrivateCustomerPersonalData.CountryOfResidence, properties.CountryOfResidence}
            };

            var customer = new Customer()
            {
                CustomerCode = properties.CustomerCode,
                CurrencyCode = "EUR",
                Email = properties.Email,
                Status = CustomerStatus.ACTIVE.ToString(), // we initially set the customer to ACTIVE
                TrustLevel = properties.Trustlevel,
                BankAccount = null,
                IsMerchant = false,
                Data = data
            };

            return customer;
        }

        public static Customer NewMerchantCustomer(MerchantCustomerProperties properties)
        {
            var data = new Dictionary<string, string>
            {
                { Constants.MerchantCustomerPersonalData.CompanyName, properties.CompanyName },
                { Constants.MerchantCustomerPersonalData.ContactPersonFullName, properties.ContactPersonFullName },
                { Constants.MerchantCustomerPersonalData.CountryOfRegistration, properties.CountryOfRegistration }
            };

            var customer = new Customer()
            {
                CustomerCode = properties.CustomerCode,
                CurrencyCode = "EUR",
                Email = properties.Email,
                Status = CustomerStatus.UNDERREVIEW.ToString(),
                TrustLevel = properties.Trustlevel,
                BankAccount = null,
                IsMerchant = true,
                Data = data
            };

            return customer;
        }

        public void IsRegisteringWhileSanctioned()
        {
            Status = CustomerStatus.UNDERREVIEW.ToString();
        }

        public void IsUsingVPN(string ip)
        {
            throw new CustomErrorsException(DomainErrorCode.UsingVPNError.ToString(), ip, "The request was made using a VPN. Please turn it off and retry again.");
        }

        public void IsRegisteringFromBlacklistedCountry(string country)
        {
            throw new CustomErrorsException(DomainErrorCode.CountryBlacklistedError.ToString(), country, "The country you are registering from is currently not supported.");
        }

        public void IsExecutingTransactionInBlacklistedCountryAsync(string country)
        {
            Status = CustomerStatus.UNDERREVIEW.ToString();
            UpdateReason = $"The customer attempted to execute a transaction from a blacklisted country: {country}";
        }

        public void IsExecutingTransactionWhileSanctionAsync(string name)
        {
            Status = CustomerStatus.UNDERREVIEW.ToString();
            UpdateReason = $"The customer attempted to execute a transaction while matched on our sanction list: {name}";
        }

        public void UploadedFile(FileType fileType, string fileUrl)
        {
            Data.Add(fileType.ToString(), fileUrl);
        }

        public string GetName()
        {
            if (IsMerchant)
            {
                return Data[Constants.MerchantCustomerPersonalData.CompanyName];
            }
            else
            {
                return $"{Data[Constants.PrivateCustomerPersonalData.FirstName]} {Data[Constants.PrivateCustomerPersonalData.LastName]}";
            }
        }

        public string GetCountry()
        {
            if (IsMerchant)
            {
                return Data[Constants.MerchantCustomerPersonalData.CountryOfRegistration];
            }
            else
            {
                return Data[Constants.PrivateCustomerPersonalData.CountryOfResidence];
            }
        }

        public Payment NewPaymentToPaymentRequest(Account senderAccount, PaymentRequest paymentRequest, decimal? amount)
        {
            if (Status.ToString() == CustomerStatus.UNDERREVIEW.ToString())
            {
                throw new CustomErrorsException(DomainErrorCode.CustomerUnderReviewError.ToString(), CustomerCode, "Cannot execute any payments because your account is currently placed under review");
            }

            if (paymentRequest.IsExpired())
            {
                throw new CustomErrorsException(DomainErrorCode.ExpiredError.ToString(), paymentRequest.Options.ExpiresOn.ToString()!, "This payment request has expired");
            }

            if (!paymentRequest.CanBeProcessed())
            {
                throw new CustomErrorsException(DomainErrorCode.InvalidStatusError.ToString(), paymentRequest.Status.ToString(), "This payment request is no longer open");
            }

            if (!paymentRequest.Options.PayerCanChangeRequestedAmount && amount.HasValue && amount != paymentRequest.RequestedAmount)
            {
                throw new CustomErrorsException(DomainErrorCode.InvalidPropertyError.ToString(), amount.ToString()!, "The provided amount does not match the requested amount of the payment request.");
            }

            if (CustomerCode == paymentRequest.CustomerCode)
            {
                throw new CustomErrorsException(DomainErrorCode.InvalidPropertyError.ToString(), paymentRequest.CustomerCode, "Cannot pay a payment request that was initiated by you");
            }

            var properties = new PaymentProperties
            {
                SenderPublicKey = senderAccount.PublicKey,
                ReceiverPublicKey = paymentRequest.PublicKey,
                Name = paymentRequest.Options.Name,
                TokenCode = paymentRequest.TokenCode,
                Amount = amount ?? paymentRequest.RequestedAmount,
                Memo = paymentRequest.Options.Memo,
                PaymentRequestId = paymentRequest.Id,
                SenderAccountCode = senderAccount.AccountCode
            };

            return Payment.NewToPaymentRequest(properties);
        }

        public Payment NewPaymentToAccount(Account fromAccount, Account toAccount, string tokenCode, decimal amount, string? memo, bool shareName)
        {
            if (Status.ToString() == CustomerStatus.UNDERREVIEW.ToString())
            {
                throw new CustomErrorsException(DomainErrorCode.CustomerUnderReviewError.ToString(), CustomerCode, "Cannot execute any payments because your account is currently placed under review");
            }

            if (fromAccount.AccountCode == toAccount.AccountCode)
            {
                throw new CustomErrorsException(DomainErrorCode.InvalidPropertyError.ToString(), toAccount.AccountCode, "Cannot execute a payment to the same account");
            }

            var properties = new PaymentProperties
            {
                SenderPublicKey = fromAccount.PublicKey,
                ReceiverPublicKey = toAccount.PublicKey,
                SenderAccountCode = fromAccount.AccountCode,
                Name = shareName ? GetName() : null,
                TokenCode = tokenCode,
                Amount = amount,
                Memo = memo,
            };

            return Payment.NewToAccount(properties);
        }

        public Withdraw NewWithdraw(Account account, string tokenCode, decimal amount, string? memo = null)
        {
            if (Status.ToString() == CustomerStatus.UNDERREVIEW.ToString())
            {
                throw new CustomErrorsException(DomainErrorCode.CustomerUnderReviewError.ToString(), CustomerCode, "Cannot execute any withdraws because your account is currently placed under review");
            }

            return new Withdraw()
            {
                PublicKey = account.PublicKey,
                TokenCode = tokenCode,
                Amount = amount,
                Memo = memo
            };

        }
    }
}
