// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Persistence.Configurations
{
    internal class CustomerDevicePublicKeysConfiguration : BaseConfiguration<CustomerDevicePublicKeys>
    {
        public override void Configure(EntityTypeBuilder<CustomerDevicePublicKeys> builder)
        {
            base.Configure(builder);

            builder.ToTable("CustomerDevicePublicKeys");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.PublicKey)
                .HasColumnName("PublicKey")
                .HasMaxLength(4096)
                .IsRequired();

            builder.Property(c => c.CreatedOn)
               .HasColumnName("CreatedOn")
               .IsRequired();

            builder.Property(c => c.UpdatedOn)
            .HasColumnName("UpdatedOn")
            .IsRequired(false);

            builder.HasOne(c => c.CustomerOTPKeyStore)
            .WithMany(c => c.PublicKeys)
            .HasForeignKey(c => c.CustomerOTPKeyStoreId)
            .IsRequired();
        }
    }
}
