// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.TokenAggregate;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.TokenQueries
{
    public class GetTokenQuery : IRequest<Token>
    {
        public string TokenCode { get; set; }

        public GetTokenQuery(string tokenCode)
        {
            TokenCode = tokenCode;
        }
    }

    public class GetTokenQueryHandler : IRequestHandler<GetTokenQuery, Token>
    {
        private readonly ITokenRepository _tokenRepository;

        public GetTokenQueryHandler(ITokenRepository tokenRepository)
        {
            _tokenRepository = tokenRepository;
        }

        public Task<Token> Handle(GetTokenQuery request, CancellationToken cancellationToken)
        {
            return _tokenRepository.GetTokenDetailsAsync(request.TokenCode, cancellationToken);
        }
    }
}
