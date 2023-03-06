using Web.SDK.ROP;
using Web.SDK.Services.Models;

namespace Web.SDK.HTTP;

public class ResponseHandler
{
    public static async Task<Result<T>> HandleResponse<T>(HttpResponseMessage httpResponse) where T : class
    {
        var json = await httpResponse.Content.ReadAsStringAsync();

        if (string.IsNullOrWhiteSpace(json))
        {
            return CustomErrorsResponse.None;
        }

        if (httpResponse.IsSuccessStatusCode)
        {
            var response = JsonSingleton.GetInstance<CustomResponse<T>>(json);

            if (response == null)
            {
                return CustomErrorsResponse.None;
            }

            return response.Value;
        }
        else
        {
            var errors = JsonSingleton.GetInstance<CustomErrorsResponse>(json);

            if (errors == null)
            {
                return CustomErrorsResponse.None;
            }

            return errors;
        }
    }

    public static async Task<Result> HandleResponse(HttpResponseMessage httpResponse)
    {
        var json = await httpResponse.Content.ReadAsStringAsync();

        if (httpResponse.IsSuccessStatusCode)
        {
            return Result.Success();
        }
        else
        {
            if (string.IsNullOrWhiteSpace(json))
            {
                return CustomErrorsResponse.None;
            }

            var errors = JsonSingleton.GetInstance<CustomErrorsResponse>(json);

            if (errors == null)
            {
                return CustomErrorsResponse.None;
            }

            return errors;
        }
    }
}
