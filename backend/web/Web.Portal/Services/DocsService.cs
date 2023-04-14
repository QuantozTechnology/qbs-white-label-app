// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Markdig;

namespace Web.Portal.Services
{
    public class DocsService
    {
        private readonly HttpClient _httpClient;

        public DocsService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        private string RenderMarkdown(string markdown)
        {
            var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
            return Markdown.ToHtml(markdown, pipeline);
        }

        public async Task<string> GetPaymentRequestDocs()
        {
            var response = await _httpClient.GetAsync("payment_request_flow.md");
            var markdown = await response.Content.ReadAsStringAsync();
             
            return RenderMarkdown(markdown);
        }
    }
}
