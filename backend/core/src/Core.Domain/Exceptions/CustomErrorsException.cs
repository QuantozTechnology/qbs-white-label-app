// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
