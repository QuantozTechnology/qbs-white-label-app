// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Queries.Interfaces;
using Core.Application.Specifications;
using Core.Domain;
using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.PaymentRequestQueries
{
    public class GetPagedPaymentRequestsForCustomerQuery : IRequest<Paged<PaymentRequest>>, IPagedQuery
    {
        public string CustomerCode { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public PaymentRequestStatus? Status { get; set; }

        public GetPagedPaymentRequestsForCustomerQuery(string customerCode, string? status, int page, int pageSize)
        {
            CustomerCode = customerCode;
            Page = page;
            PageSize = pageSize;

            if (!string.IsNullOrWhiteSpace(status)
                && Enum.TryParse(status, true, out PaymentRequestStatus paymentRequestStatus)
                && Enum.IsDefined(typeof(PaymentRequestStatus), paymentRequestStatus))
            {
                Status = paymentRequestStatus;
            }
        }
    }

    public class GetPagedPaymentRequestsForCustomerQueryHandler : IRequestHandler<GetPagedPaymentRequestsForCustomerQuery, Paged<PaymentRequest>>
    {
        private readonly IPaymentRequestRepository _paymentRequestRepository;

        public GetPagedPaymentRequestsForCustomerQueryHandler(IPaymentRequestRepository paymentRequestRepository)
        {
            _paymentRequestRepository = paymentRequestRepository;
        }

        public async Task<Paged<PaymentRequest>> Handle(GetPagedPaymentRequestsForCustomerQuery request, CancellationToken cancellationToken)
        {
            var specification = new PaymentRequestFilterPaginatedSpecification(request.CustomerCode, request.Status, request.Page, request.PageSize);

            var paymentRequests = await _paymentRequestRepository.ListAsync(specification, cancellationToken);

            var orderedPaymentRequests = paymentRequests.OrderByDescending(c => c.CreatedOn)?.ToList();

            return new Paged<PaymentRequest>
            {
                Items = orderedPaymentRequests ?? new List<PaymentRequest>(),
                Page = request.Page,
                PageSize = request.PageSize,
                Total = paymentRequests.Count
            };
        }
    }
}
