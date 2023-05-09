using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Primitives;

namespace Core.Domain.Events
{
    public record WithdrawalCreatedEvent(Withdraw Withdraw, Customer Customer) : DomainEvent;
}
