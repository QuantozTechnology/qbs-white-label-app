using System.Text;
using System.Text.Json.Serialization;

namespace Core.Domain.Exceptions
{
    public class CustomError
    {
        public CustomError(string code, string message, string target)
        {
            Code = code;
            Message = message;
            Target = target;
        }

        public string Code { get; set; }
        public string Message { get; set; }
        public string Target { get; set; }

        public override string ToString()
        {
            return $"Code: {Code}; Message: {Message}; Target: {Target}";
        }
    }

    public class CustomErrors
    {
        public List<CustomError> Errors { get; }

        public CustomErrors()
        {
            Errors = new List<CustomError>();
        }

        public CustomErrors(CustomError customError)
        {
            Errors = new List<CustomError>
            {
                customError
            };
        }

        public CustomErrors(IEnumerable<CustomError> errors)
        {
            Errors = errors.ToList();
        }

        public void AddError(CustomError customError)
        {
            Errors.Add(customError);
        }

        public bool HasErrors()
        {
            return Errors.Any();
        }

        public override string ToString()
        {
            var builder = new StringBuilder();

            foreach (var error in Errors)
            {
                builder.AppendLine(error.ToString());
            }

            return builder.ToString();
        }
    }
}
