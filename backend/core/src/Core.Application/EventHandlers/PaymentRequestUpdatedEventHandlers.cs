// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CallbackAggregate;
using Core.Domain.Events;
using Core.Domain.Repositories;
using MediatR;
using System.Text.Json;

namespace Core.Application.EventHandlers
{
    public class PaymentRequestUpdatedEventHandler : INotificationHandler<PaymentRequestPaidEvent>
    {
        private readonly ICallbackRepository _callbackRepository;
        private readonly IPaymentRequestRepository _paymentRequestRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PaymentRequestUpdatedEventHandler(ICallbackRepository callbackRepository,
            IPaymentRequestRepository paymentRequestRepository,
            IUnitOfWork unitOfWork)
        {
            _callbackRepository = callbackRepository;
            _paymentRequestRepository = paymentRequestRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task Handle(PaymentRequestPaidEvent notification, CancellationToken cancellationToken)
        {
            var paymentRequest = notification.PaymentRequest;
            var payment = notification.Payment;

            if (paymentRequest.MerchantSettings?.CallbackUrl != null)
            {
                var paymentContent = new { TransactionCode = payment.TransactionCode };
                var content = new { PaymentRequestCode = paymentRequest.Code, Payment = paymentContent };

                // Serialize the content of the callback to json
                var jsonContent = JsonSerializer.Serialize(content);

                // Add the callback to the database
                var callback = Callback.NewPaymentRequestPaidCallback(paymentRequest.MerchantSettings.CallbackUrl, jsonContent);
                _callbackRepository.Add(callback);

                // Add the callback to the existing payment request
                paymentRequest.AddCallback(callback);
                _paymentRequestRepository.Update(paymentRequest);

                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
        }
    }
}