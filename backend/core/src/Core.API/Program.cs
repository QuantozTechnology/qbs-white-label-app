using Core.API.DependencyInjection;
using Core.API.ResponseHandling;
using Microsoft.AspNetCore.Rewrite;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddPersistence(builder.Configuration)
    .AddInfrastructure(builder.Configuration)
    .AddApplication()
    .AddPresentation()
    .AddConfig(builder.Configuration)
    .AddAuthenticationAndAuthorization(builder.Configuration);

builder.Services.AddMvc().UseCustomErrorsResponseForValidationErrors();

builder.Services.AddCORSPolicy(builder.Configuration, "FromConfig");

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddLogging(loggingBuilder => loggingBuilder.AddConsole());
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseWebAssemblyDebugging();
}

app.UseCors("FromConfig");

app.UseHttpsRedirection();

app.ConfigureCustomAuthenticationMiddleware();
app.ConfigureCustomExceptionMiddleware();

app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();


// redirect the Web.Portal to use the configuration endpoint instead of the appsettings located in wwwroot
var rewriteOptions = new RewriteOptions().AddRewrite(@"^appsettings\.json$", "configuration", false);
app.UseRewriter(rewriteOptions);

app.UseBlazorFrameworkFiles();
app.MapFallbackToFile("index.html");
app.UseStaticFiles();

app.Run();
