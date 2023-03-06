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
                // Serialize the content of the callback to json
                var content = new { PaymentRequestCode = paymentRequest.Code, payment };
                var jsonContent = JsonSerializer.Serialize(content);

                // Add the callback to the database
                var callback = Callback.NewPaymentRequestUpdatedCallback(paymentRequest.MerchantSettings.CallbackUrl, jsonContent);
                _callbackRepository.Add(callback);

                // Add the callback to the existing payment request
                paymentRequest.AddCallback(callback);
                _paymentRequestRepository.Update(paymentRequest);

                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
        }
    }
}