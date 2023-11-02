// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Quartz;
using System.Net.Http.Json;

namespace Core.Infrastructure.Jobs
{
    public class ProcessEmailsJob : IJob
    {
        private readonly HttpClient _client;
        private readonly ILogger<ProcessEmailsJob> _logger;
        private readonly ICallbackRepository _callbackRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProcessEmailsJob(HttpClient client,
            ILogger<ProcessEmailsJob> logger,
            ICallbackRepository callbackRepository,
            IUnitOfWork unitOfWork)
        {
            _client = client;
            _logger = logger;
            _callbackRepository = callbackRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var callbacks = await _callbackRepository.GetLatestCreatedAsync(context.CancellationToken);

            if (callbacks.Any())
            {
                _logger.LogInformation("Sending callbacks");

                foreach (var callback in callbacks)
                {
                    var body = new
                    {
                        callback.Code,
                        callback.Content,
                        CreatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(callback.CreatedOn),
                        Type = callback.Type.ToString()
                    };

                    try
                    {
                        var response = await _client.PostAsJsonAsync(callback.DestinationUrl, body);

                        if (response.IsSuccessStatusCode)
                        {
                            callback.Sent();
                        }
                        else
                        {
                            callback.Failed();
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("An error occured sending callback {code} with message {message}", callback.Code, ex.Message);
                        callback.Failed();
                    }


                    _callbackRepository.Update(callback);
                }

                await _unitOfWork.SaveChangesAsync();
            }
        }
    }
}
