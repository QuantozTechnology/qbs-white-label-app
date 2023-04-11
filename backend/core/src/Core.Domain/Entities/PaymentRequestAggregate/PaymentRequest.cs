// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CallbackAggregate;
using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Events;
using Core.Domain.Primitives;
using Core.Domain.Primitives.PaymentRequest;

namespace Core.Domain.Entities.PaymentRequestAggregate
{
    public class PaymentRequest : Entity
    {
        public string Code { get; set; }

        public string CustomerCode { get; set; }

        public string PublicKey { get; set; }

        public string TokenCode { get; set; }

        public decimal RequestedAmount { get; set; }

        public PaymentRequestStatus Status { get; set; }

        public bool IsMerchant { get; set; }

        public PaymentRequestOptions Options { get; set; } = new PaymentRequestOptions();

        public MerchantSettings? MerchantSettings { get; set; }

        public DateTimeOffset CreatedOn { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public ICollection<Callback> Callbacks { get; set; } = new List<Callback>();

        public ICollection<Payment> Payments { get; set; } = new List<Payment>();

        public PaymentRequest(string customerCode, string publicKey, string tokenCode, decimal amount, bool isMerchant)
        {
            Code = Guid.NewGuid().ToString();
            CustomerCode = customerCode;
            PublicKey = publicKey;
            TokenCode = tokenCode;
            RequestedAmount = amount;
            IsMerchant = isMerchant;
            Status = PaymentRequestStatus.Open;
            CreatedOn = DateTimeProvider.UtcNow;
        }

        public static PaymentRequest New(PaymentRequestProperties properties)
        {
            return new PaymentRequest(properties.CustomerCode, properties.PublicKey, properties.TokenCode, properties.Amount, false)
            {
                Options = properties.Options
            };
        }

        public static PaymentRequest NewMerchant(MerchantPaymentRequestProperties properties)
        {
            return new PaymentRequest(properties.CustomerCode, properties.PublicKey, properties.TokenCode, properties.Amount, true)
            {
                Options = properties.Options,
                MerchantSettings = properties.MerchantSettings
            };
        }

        public void Paid(Payment payment)
        {
            UpdatedOn = DateTimeProvider.UtcNow;

            if (Options.IsOneOffPayment)
            {
                Status = PaymentRequestStatus.Paid;
            }

            Payments.Add(payment);

            RaiseDomainEvent(new PaymentRequestPaidEvent(this, payment));
        }

        public void Cancel()
        {
            if (Status == PaymentRequestStatus.Open)
            {
                UpdatedOn = DateTimeProvider.UtcNow;
                Status = PaymentRequestStatus.Cancelled;
            }
        }

        public bool HasExpired()
        {
            return Status == PaymentRequestStatus.Expired;
        }

        public bool CanBeProcessed()
        {
            var isOneOffAndProcessing = Options.IsOneOffPayment && Status == PaymentRequestStatus.Processing;
            var isNotOneOffAndOpen = !Options.IsOneOffPayment && Status == PaymentRequestStatus.Open;
            return isOneOffAndProcessing || isNotOneOffAndOpen;
        }

        public void AddCallback(Callback callback)
        {
            Callbacks.Add(callback);
        }

        public void Processing()
        {
            // we only set it to processing if we need to process this payment request sequentially
            if (Options.IsOneOffPayment)
            {
                UpdatedOn = DateTimeProvider.UtcNow;
                Status = PaymentRequestStatus.Processing;
            }
        }

        public void ProcessingFailed()
        {
            // we only set it to open if we the payment request was processed sequentially
            if (Options.IsOneOffPayment)
            {
                UpdatedOn = DateTimeProvider.UtcNow;
                Status = PaymentRequestStatus.Open;
            }
        }

        // Required for EF Core
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public PaymentRequest() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

    }
}
