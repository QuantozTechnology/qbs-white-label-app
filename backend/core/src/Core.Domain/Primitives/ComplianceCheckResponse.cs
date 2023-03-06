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
