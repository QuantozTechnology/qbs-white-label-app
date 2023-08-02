// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CallbackAggregate;
using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Events;
using Core.Domain.Primitives;
using Core.Domain.Primitives.Offer;

namespace Core.Domain.Entities.OfferAggregate
{
    public class Offer : Entity
    {
        public string OfferCode { get; set; }

        public string CustomerCode { get; set; }

        public string PublicKey { get; set; }

        public string SourceTokenCode { get; set; }

        public decimal SourceTokenAmount { get; set; }

        public decimal? SourceTokenRemainingAmount { get; set; }

        public string DestinationTokenCode { get; set; }

        public decimal DestinationTokenAmount { get; set; }

        public decimal? DestinationTokenRemainingAmount { get; set; }

        public string OfferAction { get; set; }

        public decimal PricePerUnit { get; set; }

        public OfferStatus Status { get; set; }

        public bool IsMerchant { get; set; }

        public OfferOptions Options { get; set; } = new OfferOptions();

        public MerchantOfferSettings? MerchantOfferSettings { get; set; }

        public DateTimeOffset CreatedOn { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public ICollection<Callback> Callbacks { get; set; } = new List<Callback>();

        public ICollection<Payment> Payments { get; set; } = new List<Payment>();

        public Offer(string? offerCode, string customerCode, string publicKey, string sourceTokenCode, decimal sourceTokenAmount,
            string destinationTokenCode, decimal destinationTokenAmount, string offerAction, decimal pricePerUnit,
            bool isMerchant, decimal? sourceTokenRemainingAmount = null, decimal? destinationTokenRemainingAmount = null)
        {
            OfferCode = offerCode ?? Guid.NewGuid().ToString();
            CustomerCode = customerCode;
            PublicKey = publicKey;
            SourceTokenCode = sourceTokenCode;
            SourceTokenAmount = sourceTokenAmount;
            DestinationTokenCode = destinationTokenCode;
            DestinationTokenAmount = destinationTokenAmount;
            IsMerchant = isMerchant;
            Status = OfferStatus.Open;
            OfferAction = offerAction;
            CreatedOn = DateTimeProvider.UtcNow;
            PricePerUnit = pricePerUnit;
            SourceTokenRemainingAmount = sourceTokenRemainingAmount;
            DestinationTokenRemainingAmount = destinationTokenRemainingAmount;
        }

        public static Offer New(OfferProperties properties)
        {
            return new Offer(properties.OfferCode, properties.CustomerCode, properties.PublicKey, properties.SourceTokenCode, properties.SourceTokenAmount, properties.DestinationTokenCode, properties.DestinationTokenAmount, properties.OfferAction, properties.PricePerUnit, false, properties.SourceTokenRemainingAmount, properties.DestinationTokenRemainingAmount)
            {
                Options = properties.Options
            };
        }

        public void Processing()
        {
            // we only set it to processing if we need to process this offer sequentially
            if (Options.IsOneOffPayment)
            {
                UpdatedOn = DateTimeProvider.UtcNow;
                Status = OfferStatus.Processing;
            }
        }

        public bool HasExpired()
        {
            return Status == OfferStatus.Expired;
        }

        public bool CanBeProcessed()
        {
            var isOneOffAndProcessing = Options.IsOneOffPayment && Status == OfferStatus.Processing;
            var isNotOneOffAndOpen = !Options.IsOneOffPayment && Status == OfferStatus.Open;
            return isOneOffAndProcessing || isNotOneOffAndOpen;
        }

        public void Closed()
        {
            UpdatedOn = DateTimeProvider.UtcNow;

            if (Options.IsOneOffPayment)
            {
                Status = OfferStatus.Closed;
            }

            //Payments.Add(payment);

            //RaiseDomainEvent(new PaymentRequestPaidEvent(this, payment));
        }

        public void ProcessingFailed()
        {
            // we only set it to open if the offer was processed sequentially
            if (Options.IsOneOffPayment)
            {
                UpdatedOn = DateTimeProvider.UtcNow;
                Status = OfferStatus.Open;
            }
        }

        public void Cancel()
        {
            if (Status == OfferStatus.Open)
            {
                UpdatedOn = DateTimeProvider.UtcNow;
                Status = OfferStatus.Cancelled;
            }
        }

        // Required for EF Core
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public Offer() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

    }
}
