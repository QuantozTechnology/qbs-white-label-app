// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.PaymentRequestAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Persistence.Configurations
{
    internal class PaymentRequestConfiguration : BaseConfiguration<PaymentRequest>
    {
        public override void Configure(EntityTypeBuilder<PaymentRequest> builder)
        {
            base.Configure(builder);

            builder.ToTable("PaymentRequest");

            builder.HasKey(pr => pr.Id);

            builder.Property(pr => pr.PublicKey)
                .HasColumnName("PublicKey")
                .HasMaxLength(64)
                .IsRequired();

            builder.Property(pr => pr.CustomerCode)
                .HasColumnName("CustomerCode")
                .HasMaxLength(40)
                .IsRequired();

            builder.Property(pr => pr.Code)
                .HasColumnName("Code")
                .HasMaxLength(40)
                .IsRequired();

            builder.Property(pr => pr.IsMerchant)
                .HasColumnName("IsMerchant")
                .IsRequired();

            builder.Property(pr => pr.TokenCode)
                .HasColumnName("TokenCode")
                .HasMaxLength(12)
                .IsRequired();

            builder.Property(pr => pr.Status)
                .HasColumnName("Status")
                .IsRequired();

            builder.Property(pr => pr.RequestedAmount)
                .HasColumnName("RequestedAmount")
                .HasPrecision(18, 8)
                .IsRequired();

            builder.HasMany(pr => pr.Callbacks)
                .WithOne();

            builder.HasMany(po => po.Payments)
                .WithOne();

            builder.Property(pr => pr.CreatedOn)
                  .HasColumnName("CreatedOn")
                  .IsRequired();

            builder.Property(pr => pr.UpdatedOn)
                    .HasColumnName("UpdatedOn");

            builder.OwnsOne(pr => pr.MerchantSettings, o =>
            {

                o.Property(mr => mr.ReturnUrl)
                    .HasColumnName("ReturnUrl")
                    .HasMaxLength(100)
                    .IsRequired();

                o.Property(mr => mr.CallbackUrl)
                    .HasColumnName("CallbackUrl")
                    .HasMaxLength(100);
            });

            builder.OwnsOne(pr => pr.Options, o =>
            {
                o.Property(po => po.Name)
                    .HasColumnName("Name")
                    .HasMaxLength(50);

                o.Property(po => po.Memo)
                   .HasColumnName("Memo")
                   .HasMaxLength(28);

                o.Property(po => po.ExpiresOn)
                   .HasColumnName("ExpiresOn");

                o.Property(po => po.IsOneOffPayment)
                   .HasColumnName("IsOneOffPayment");

                o.Property(po => po.PayerCanChangeRequestedAmount)
                   .HasColumnName("PayerCanChangeRequestedAmount");

                o.OwnsMany(o => o.Params, o =>
                {
                    o.ToTable("PaymentRequestParams");

                    o.WithOwner().HasForeignKey("PaymentRequestId");

                    o.Property(kv => kv.Key)
                        .HasColumnName("Key")
                        .HasMaxLength(50)
                        .IsRequired();

                    o.Property(kv => kv.Value)
                        .HasColumnName("Value")
                        .HasMaxLength(50)
                        .IsRequired();
                });
            });
        }
    }
}
