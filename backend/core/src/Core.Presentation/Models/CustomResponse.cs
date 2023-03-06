using System.Text.Json.Serialization;

namespace Core.Presentation.Models
{
    public class CustomResponse<T>
    {
        public CustomResponse(T value)
        {
            Value = value;
        }
        public T Value { get; set; }
    }

    public class EmptyCustomResponse
    {
        public object? Value { get; set; }
        public EmptyCustomResponse()
        {
            Value = new();
        }
    }
}