﻿// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Core.Application.Pipelines
{
    public class LoggingBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly ILogger<LoggingBehaviour<TRequest, TResponse>> _logger;

        public LoggingBehaviour(ILogger<LoggingBehaviour<TRequest, TResponse>> logger)
        {
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            try
            {
                var response = await next();
                return response;
            }
            catch (CustomErrorsException ex)
            {
                if (request != null)
                {
                    var json = JsonSerializer.Serialize(request);
                    _logger.LogError("An error occured handling {command} with content: {json} and {error}", typeof(TRequest).Name, json, ex.ToString());
                }
                throw ex;
            }
        }
    }
}
