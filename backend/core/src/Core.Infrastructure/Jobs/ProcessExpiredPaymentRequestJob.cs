using Core.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Quartz;

namespace Core.Infrastructure.Jobs
{
    public class ProcessExpiredPaymentRequestJob : IJob
    {
        private readonly ILogger<ProcessExpiredPaymentRequestJob> _logger;
        private readonly IPaymentRequestRepository _paymentRequestRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProcessExpiredPaymentRequestJob(
            ILogger<ProcessExpiredPaymentRequestJob> logger,
            IPaymentRequestRepository paymentRequestRepository,
            IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _paymentRequestRepository = paymentRequestRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("Checking for payment requests to expire");

            var paymentRequests = await _paymentRequestRepository.GetOpenPaymentRequestsToExpireAsync(context.CancellationToken);

            if (paymentRequests.Any())
            {
                _logger.LogInformation("Updating{0} payment requests to expired", paymentRequests.Count());

                foreach (var paymentRequest in paymentRequests)
                {
                    paymentRequest.Status = Domain.PaymentRequestStatus.Expired;

                    _paymentRequestRepository.Update(paymentRequest);
                }

                await _unitOfWork.SaveChangesAsync();
            }
        }
    }
}
