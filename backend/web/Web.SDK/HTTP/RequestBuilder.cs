// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.Text;
using System.Text.Json;
using Web.SDK.ROP;

namespace Web.SDK.HTTP;

public class RequestBuilder
{
    private readonly HttpClient _httpClient;

    private bool _segmentsAdded;
    private bool _queryParametersAdded;

    private readonly List<string> _segments;
    private IDictionary<string, string> _queryParameters;

    public RequestBuilder(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _segments = new List<string>();
        _queryParameters = new Dictionary<string, string>();
        _segmentsAdded = false; //Allow overwriting segments
    }

    public async Task<Result<TResponse>> ExecuteGet<TResponse>(CancellationToken cancellationToken = default) where TResponse : class
    {
        var path = BuildPath();

        var response = await _httpClient.GetAsync(path, cancellationToken);
        return await ResponseHandler.HandleResponse<TResponse>(response);
    }

    public async Task<Result> ExecutePost<TRequest>(TRequest request, CancellationToken cancellationToken = default) where TRequest : class
    {
        var json = JsonSerializer.Serialize(request);
        var path = BuildPath();

        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(path, content);

        return await ResponseHandler.HandleResponse(response);
    }

    public async Task<Result<TResponse>> ExecutePost<TRequest, TResponse>(TRequest request, CancellationToken cancellationToken = default)
        where TRequest : class where TResponse : class
    {
        var json = JsonSerializer.Serialize(request);
        var path = BuildPath();

        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(path, content, cancellationToken);

        return await ResponseHandler.HandleResponse<TResponse>(response);
    }

    public RequestBuilder SetSegments(params string[] segments)
    {
        if (_segmentsAdded)
            throw new Exception("URL segments have already been added.");

        _segmentsAdded = true;

        foreach (var segment in segments)
            _segments.Add(segment);

        return this;
    }

    public RequestBuilder SetQueryParameters(IDictionary<string, string> queryParameters)
    {
        if (_queryParametersAdded)
            throw new Exception("Query parameters have already been set.");

        _queryParametersAdded = true;
        _queryParameters = queryParameters;

        return this;
    }

    public RequestBuilder AddQueryParameter(string key, string value)
    {
        _queryParametersAdded = true;
        _queryParameters.Add(key, value);

        return this;
    }

    private void ResetSegments()
    {
        if (_segmentsAdded)
        {
            _segments.Clear();
            _segmentsAdded = false;
        }
    }

    private void ResetQueryParameters()
    {
        if (_queryParametersAdded)
        {
            _queryParameters?.Clear();
            _queryParametersAdded = false;
        }
    }

    private string BuildPath()
    {
        var builder = new StringBuilder();

        if (_segments.Any())
        {
            foreach (var segment in _segments)
            {
                builder.Append('/');
                builder.Append(segment);
            }

            if (_queryParameters != null && _queryParameters.Any())
            {
                string query = BuildQuerystring(_queryParameters);
                builder.Append('?');
                builder.Append(query);
            }

            // After building the url we reset the segments for the next request.
            ResetSegments();
            ResetQueryParameters();
            return builder.ToString();
        }

        throw new NotSupportedException("No segments defined.");
    }

    private string BuildQuerystring(IDictionary<string, string> querystringParams)
    {
        List<string> paramList = new List<string>();

        foreach (var parameter in querystringParams)
        {
            paramList.Add(parameter.Key + "=" + parameter.Value);
        }

        return string.Join("&", paramList);
    }

    protected void AddDefaultRequestHeader(string key, string value)
    {
        _httpClient.DefaultRequestHeaders.Add(key, value);
    }
}
