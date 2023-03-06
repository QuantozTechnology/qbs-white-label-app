using MediatR;

namespace Core.Domain.Primitives
{
    public abstract record DomainEvent : INotification { }
}
