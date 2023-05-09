// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Abstractions;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net;

namespace Core.Infrastructure.Email
{
    public class EmailService : IEmailService
    {
        private readonly ISendGridClient _client;
        private readonly EmailServiceOptions _options;

        public EmailService(
            ISendGridClient client,
            EmailServiceOptions options)
        {
            _client = client;
            _options = options;
        }

        public async Task SendEmailAsync<T>(IEnumerable<string> recipients,  T templateData, string templateId, string? subject = null)
        {
            var templateDataDictionary = await GetTemplateAsync(templateId);

            var from = new EmailAddress(_options.Sender);
            var tos = recipients.Select(x => new EmailAddress(x)).ToList();

            // Fill in the placeholders in the template with the data
            foreach (var kvp in templateDataDictionary)
            {
                var placeholder = $"{{{{ {kvp.Key} }}}}";
                var replacement = kvp.Value.ToString();
                subject = subject.Replace(placeholder, replacement);
                if (templateData is IDictionary<string, object> dict)
                {
                    dict[kvp.Key] = replacement;
                }
            }

            var msg = MailHelper.CreateSingleTemplateEmailToMultipleRecipients(from, tos, templateId, templateData);
            msg.Subject = subject;

            var response = await _client.SendEmailAsync(msg);

            if (response.StatusCode != HttpStatusCode.Accepted)
            {
                throw new Exception($"Failed to send email. Status code: {response.StatusCode}");
            }
        }

        private async Task<Dictionary<string, string>> GetTemplateAsync(string templateId)
        {
            var response = await _client.RequestAsync(
                BaseClient.Method.GET,
                urlPath: $"/v3/templates/{templateId}"
        );

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Failed to get email template. Status code: {response.StatusCode}");
            }

            var json = await response.Body.ReadAsStringAsync() ?? throw new Exception("Failed to retrieve SendGrid template");
            return JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
        }
    }
}
