using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Web.SDK.Services.Models
{
    public class CustomErrorsResponse
    {
        public static readonly CustomErrorsResponse None = new() { Errors = Array.Empty<CustomErrorResponse>() };

        public required IEnumerable<CustomErrorResponse> Errors { get; set; }
    }

    public record CustomErrorResponse()
    {
        public required string Code { get; set; }
        public required string Message { get; set; }
        public required string Target { get; set; }
    }
}
