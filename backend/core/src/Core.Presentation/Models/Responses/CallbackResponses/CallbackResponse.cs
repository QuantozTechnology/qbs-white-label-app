using Core.Domain;
using Core.Domain.Entities.CallbackAggregate;

namespace Core.Presentation.Models.Responses.CallbackResponses
{
    public class CallbackResponse
    {
        public required string Code { get; set; }

        public required string Type { get; set; }

        public required string Status { get; set; }

        public long CreatedOn { get; set; }

        public long? UpdatedOn { get; set; }


        public static CallbackResponse FromCallback(Callback callback)
        {
            return new CallbackResponse
            {
                Code = callback.Code,
                Status = callback.Status.ToString(),
                Type = callback.Type.ToString(),
                CreatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(callback.CreatedOn),
                UpdatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(callback.UpdatedOn)
            };
        }
    }
}
