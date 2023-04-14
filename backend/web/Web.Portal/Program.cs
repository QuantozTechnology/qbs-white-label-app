// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Web.Portal;
using Web.Portal.Services;
using Web.SDK.Extensions;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddCoreAPI<AuthorizationProvider>(new Uri(builder.HostEnvironment.BaseAddress));

builder.Services.AddScoped<DocsService>();
builder.Services.AddHttpClient<DocsService>(client =>
{
    client.BaseAddress = new Uri(builder.HostEnvironment.BaseAddress + "docs/");
});

builder.Services.AddMsalAuthentication(options =>
{
    builder.Configuration.Bind("Portal:AzureAd", options.ProviderOptions.Authentication);
    options.ProviderOptions.DefaultAccessTokenScopes = builder.Configuration.GetRequiredSection("Portal:AzureAd:DefaultScopes").Get<string[]>() ?? throw new Exception("Default scopes are required.");
    options.ProviderOptions.LoginMode = "redirect";
    options.ProviderOptions.Cache.CacheLocation = "localStorage";
    options.ProviderOptions.Cache.StoreAuthStateInCookie = true;
});

await builder.Build().RunAsync();
