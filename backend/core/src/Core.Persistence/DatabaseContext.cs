using Core.Domain.Entities.CallbackAggregate;
using Core.Domain.Entities.PaymentRequestAggregate;
using Microsoft.EntityFrameworkCore;

namespace Core.Persistence
{
    public class DatabaseContext : DbContext
    {
        public DbSet<PaymentRequest> PaymentRequests { get; set; }
        public DbSet<Callback> Callbacks { get; set; }

        public DatabaseContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder) => modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
    }
}
