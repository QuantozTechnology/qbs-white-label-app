// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.TransactionAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Persistence.Configurations
{
    internal class PaymentConfiguration : BaseConfiguration<Payment>
    {
        public override void Configure(EntityTypeBuilder<Payment> builder)
        {
            base.Configure(builder);

            builder.ToTable("Payment");

            builder.HasKey(pr => pr.Id);

            builder.Property(pr => pr.SenderPublicKey)
                .HasColumnName("SenderPublicKey")
                .HasMaxLength(64)
                .IsRequired();

            builder.Property(pr => pr.ReceiverPublicKey)
                .HasColumnName("ReceiverPublicKey")
                .HasMaxLength(64)
                .IsRequired();

            builder.Property(pr => pr.SenderName)
                .HasColumnName("SenderName")
                .HasMaxLength(50);

            builder.Property(pr => pr.ReceiverName)
                .HasColumnName("ReceiverName")
                .HasMaxLength(50);

            builder.Property(pr => pr.TokenCode)
                .HasColumnName("TokenCode")
                .HasMaxLength(12)
                .IsRequired();

            builder.Property(pr => pr.TransactionCode)
                .HasColumnName("TransactionCode")
                .HasMaxLength(32);

            builder.Property(pr => pr.SenderAccountCode)
                .HasColumnName("SenderAccountCode")
                .HasMaxLength(10);

            builder.Property(pr => pr.Amount)
                .HasColumnName("Amount")
                .HasPrecision(18, 8)
                .IsRequired();

            builder.Property(po => po.Memo)
                .HasColumnName("Memo")
                .HasMaxLength(28);

            builder.HasOne(po => po.PaymentRequest)
                .WithMany()
                .HasForeignKey(po => po.PaymentRequestId);

            builder.Property(c => c.CreatedOn)
                .HasColumnName("CreatedOn")
                .IsRequired();

            builder.Property(c => c.UpdatedOn)
                .HasColumnName("UpdatedOn");
        }
    }
}
