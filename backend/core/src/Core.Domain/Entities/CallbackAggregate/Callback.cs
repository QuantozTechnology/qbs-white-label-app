﻿// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Primitives;

namespace Core.Domain.Entities.CallbackAggregate
{
    public class Callback : Entity
    {
        public string Code { get; set; }

        public string Content { get; set; }

        public CallbackType Type { get; set; }

        public CallbackStatus Status { get; set; }

        public string DestinationUrl { get; set; }

        public DateTimeOffset CreatedOn { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public Callback(CallbackType type, string destinationUrl, string content)
        {
            Code = Guid.NewGuid().ToString();
            Type = type;
            Content = content;
            DestinationUrl = destinationUrl;
            CreatedOn = DateTimeProvider.UtcNow;
        }

        public static Callback NewPaymentRequestPaidCallback(string destinationUrl, string content)
        {
            return new Callback(CallbackType.PaymentRequestPaid, destinationUrl, content);
        }

        public void Sent()
        {
            Status = CallbackStatus.Sent;
            UpdatedOn = DateTimeProvider.UtcNow;
        }

        public void Failed()
        {
            Status = CallbackStatus.Failed;
            UpdatedOn = DateTimeProvider.UtcNow;
        }

        // Required for EF Core
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public Callback() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    }

    public enum CallbackStatus
    {
        Created,
        Sent,
        Failed
    }

    public enum CallbackType
    {
        PaymentRequestPaid
    }
}
