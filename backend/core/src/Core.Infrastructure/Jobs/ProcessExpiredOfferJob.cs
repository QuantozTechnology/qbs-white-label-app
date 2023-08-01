// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Quartz;

namespace Core.Infrastructure.Jobs
{
    public class ProcessExpiredOfferJob : IJob
    {
        private readonly ILogger<ProcessExpiredOfferJob> _logger;
        private readonly IOfferRepository _offerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProcessExpiredOfferJob(
            ILogger<ProcessExpiredOfferJob> logger,
            IOfferRepository offerRepository,
            IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _offerRepository = offerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("Checking for offers to expire");

            var offers = await _offerRepository.GetOpenOffersToExpireAsync(context.CancellationToken);

            if (offers.Any())
            {
                _logger.LogInformation("Updating {0} offers expired", offers.Count());

                foreach (var offer in offers)
                {
                    offer.Status = OfferStatus.Expired;

                    _offerRepository.Update(offer);
                }

                await _unitOfWork.SaveChangesAsync();
            }
        }
    }
}
