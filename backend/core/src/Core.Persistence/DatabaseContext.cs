// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
