// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Events;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.EventHandlers
{
    public class OfferUpdatedEventHandler : INotificationHandler<OfferClosedEvent>
    {
        private readonly ICallbackRepository _callbackRepository;
        private readonly IOfferRepository _offerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public OfferUpdatedEventHandler(ICallbackRepository callbackRepository,
            IOfferRepository offerRepository,
            IUnitOfWork unitOfWork)
        {
            _callbackRepository = callbackRepository; 
            _offerRepository = offerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task Handle(OfferClosedEvent notification, CancellationToken cancellationToken)
        {
            var offer = notification.Offer;
            var payments = notification.Payments;

            //if (offer.MerchantSettings?.CallbackUrl != null)
            //{
            //    var paymentContent = new { TransactionCode = payment.TransactionCode };
            //    var content = new { PaymentRequestCode = paymentRequest.Code, Payment = paymentContent };

            //    // Serialize the content of the callback to json
            //    var jsonContent = JsonSerializer.Serialize(content);

            //    // Add the callback to the database
            //    var callback = Callback.NewPaymentRequestPaidCallback(paymentRequest.MerchantSettings.CallbackUrl, jsonContent);
            //    _callbackRepository.Add(callback);

            //    // Add the callback to the existing payment request
            //    paymentRequest.AddCallback(callback);
            //    _paymentRequestRepository.Update(paymentRequest);

            //    await _unitOfWork.SaveChangesAsync(cancellationToken);
            //}
        }
    }
}