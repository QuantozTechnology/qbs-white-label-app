using Core.Domain;
using Core.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Quartz;
using System.Net.Http.Json;

namespace Core.Infrastructure.Jobs
{
    public class ProcessCallbacksJob : IJob
    {
        private readonly HttpClient _client;
        private readonly ILogger<ProcessCallbacksJob> _logger;
        private readonly ICallbackRepository _callbackRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProcessCallbacksJob(HttpClient client,
            ILogger<ProcessCallbacksJob> logger,
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

                    var response = await _client.PostAsJsonAsync(callback.DestinationUrl, body);

                    if (response.IsSuccessStatusCode)
                    {
                        callback.Sent();
                    }
                    else
                    {
                        callback.Failed();
                    }

                    _callbackRepository.Update(callback);
                }

                await _unitOfWork.SaveChangesAsync();
            }
        }
    }
}
