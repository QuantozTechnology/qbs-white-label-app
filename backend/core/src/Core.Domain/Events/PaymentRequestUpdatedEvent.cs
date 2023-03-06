using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Primitives;

namespace Core.Domain.Events
{
    public record PaymentRequestPaidEvent(PaymentRequest PaymentRequest, Payment Payment) : DomainEvent;
}
