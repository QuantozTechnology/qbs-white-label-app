// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Persistence.Configurations
{
    internal class CustomerOTPKeyStoreConfiguration : BaseConfiguration<CustomerOTPKeyStore>
    {
        public override void Configure(EntityTypeBuilder<CustomerOTPKeyStore> builder)
        {
            base.Configure(builder);

            builder.ToTable("CustomerOTPKeyStorage");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.CustomerCode)
                .HasColumnName("CustomerCode")
                .HasMaxLength(40)
                .IsRequired();

            builder.Property(c => c.OTPKey)
                .HasColumnName("OTPKey")
                .HasMaxLength(40)
                .IsRequired();

            builder.Property(c => c.CreatedOn)
               .HasColumnName("CreatedOn")
               .IsRequired();

            builder.Property(c => c.UpdatedOn)
            .HasColumnName("UpdatedOn")
            .IsRequired(false);

            builder.HasMany(c => c.PublicKeys)
            .WithOne(c => c.CustomerOTPKeyStore)
            .HasForeignKey(c => c.CustomerOTPKeyStoreId);
        }
    }
}
