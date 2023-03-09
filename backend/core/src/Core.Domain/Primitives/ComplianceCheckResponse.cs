// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Primitives
{
    public class ComplianceCheckResponse
    {
        public string FailedPropertyName { get; set; } = string.Empty;
        public ComplianceCheckResult Result { get; set; }

        public ComplianceCheckResponse(ComplianceCheckResult state, string failedOn)
        {
            FailedPropertyName = failedOn;
            Result = state;
        }

        public bool HasPassed => Result == ComplianceCheckResult.Passed;

        public static ComplianceCheckResponse Passed()
        {
            return new ComplianceCheckResponse(ComplianceCheckResult.Passed, string.Empty);
        }

        public static ComplianceCheckResponse Failed(ComplianceCheckResult state, string failedOn)
        {
            return new ComplianceCheckResponse(state, failedOn);
        }
    }
}
