// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Queries.Interfaces;
using Core.Domain;
using Core.Domain.Entities.TokenAggregate;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.TokenQueries
{
    public class GetPagedTokensQuery : IRequest<Paged<Token>>, IPagedQuery
    {
        public string CustomerCode { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public TokenAvailability? Availability { get; set; }

        public GetPagedTokensQuery(string customerCode, string? availability, int page, int pageSize)
        {
            CustomerCode = customerCode;
            Page = page;
            PageSize = pageSize;

            if (!string.IsNullOrWhiteSpace(availability)
                && Enum.TryParse(availability, true, out TokenAvailability tokenAvailability)
                && Enum.IsDefined(typeof(TokenAvailability), tokenAvailability))
            {
                Availability = tokenAvailability;
            }
        }
    }

    public class GetPagedTokensQueryHandler : IRequestHandler<GetPagedTokensQuery, Paged<Token>>
    {
        private readonly ITokenRepository _tokenRepository;
        private readonly IAccountRepository _accountRepository;

        public GetPagedTokensQueryHandler(ITokenRepository tokenRepository,
            IAccountRepository accountRepository)
        {
            _tokenRepository = tokenRepository;
            _accountRepository = accountRepository;
        }

        public async Task<Paged<Token>> Handle(GetPagedTokensQuery request, CancellationToken cancellationToken)
        {
            var account = await _accountRepository.GetByCustomerCodeAsync(request.CustomerCode);

            return await _tokenRepository.GetAsync(account.PublicKey, request.Availability, request.Page, request.PageSize);
        }
    }
}
