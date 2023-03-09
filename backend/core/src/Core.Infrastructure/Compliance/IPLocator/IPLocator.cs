// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Core.Infrastructure.Compliance.IPLocator.Models;
using System.Text.Json;

namespace Core.Infrastructure.Compliance.IPLocator
{
    public class IPLocator : IIPLocator
    {
        private readonly HttpClient _httpClient;
        private readonly IPServiceOptions _settings;

        public IPLocator(HttpClient httpClient, IPServiceOptions settings)
        {
            _settings = settings;
            _httpClient = httpClient;
        }

        public async Task<ISPResponse> GetISP(string ip)
        {
            return await GetGeoInfo(ip, TimeSpan.FromSeconds(5));
        }

        private async Task<ISPResponse> GetGeoInfo(string ip, TimeSpan? timeout = null)
        {
            var requestUri = $"/json/{ip}?fields=66842623&key={_settings.Key}";

            _httpClient.Timeout = timeout ?? TimeSpan.FromSeconds(2);

            var response = await _httpClient.GetAsync(requestUri);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new CustomErrorsException("IPService", ip, "An error occured getting information on the IP address");
            }

            return JsonSerializer.Deserialize<ISPResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
        }
    }
}
