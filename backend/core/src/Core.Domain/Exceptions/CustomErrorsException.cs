namespace Core.Domain.Exceptions
{
    public class CustomErrorsException : Exception
    {
        public CustomErrors CustomErrors = new();

        public CustomErrorsException(string code, string target, string message)
        {
            CustomErrors.AddError(new CustomError(code, message, target));
        }

        public CustomErrorsException(IEnumerable<CustomError> customErrors)
        {
            CustomErrors = new CustomErrors(customErrors);
        }

        public override string ToString()
        {
            return CustomErrors.ToString();
        }
    }
}
