// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SigningService.API.Data;

public class SigningPairConfiguration : IEntityTypeConfiguration<SigningPair>
{
    public void Configure(EntityTypeBuilder<SigningPair> builder)
    {
        // primary key
        builder.HasKey(t => t.Id);

        // properties
        builder.Property(t => t.PublicKey)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(t => t.CreatedOn)
            .IsRequired();

        // Table & Column Mappings
        builder.ToTable("SigningPair");
        builder.Property(t => t.Id).HasColumnName("Id");
        builder.Property(t => t.PublicKey).HasColumnName("PublicKey");
        builder.Property(t => t.CreatedOn).HasColumnName("CreatedOn");
        builder.Property(t => t.Index).HasColumnName("Index");
        builder.Property(t => t.CryptoCode).HasColumnName("CryptoCode");
        builder.Property(t => t.LabelPartnerCode).HasColumnName("LabelPartnerCode");

        // unique constraints
        builder.HasIndex(t => t.PublicKey)
            .IsUnique();
    }
}
