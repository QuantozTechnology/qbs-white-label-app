using MediatR;

namespace Core.Application.Abstractions
{
    public interface IWithComplianceCheckCommand<TResponse> : IRequest<TResponse>
    {
        public string CustomerCode { get; set; }

        public string IP { get; set; }
    }
}
