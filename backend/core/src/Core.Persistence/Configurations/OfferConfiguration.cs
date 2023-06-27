using Core.Domain.Entities.OfferAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Persistence.Configurations
{
    internal class OfferConfiguration : BaseConfiguration<Offer>
    {
        public override void Configure(EntityTypeBuilder<Offer> builder)
        {
            base.Configure(builder);

            builder.ToTable("Offer");

            builder.HasKey(pr => pr.Id);

            builder.Property(pr => pr.PublicKey)
                .HasColumnName("PublicKey")
                .HasMaxLength(64)
                .IsRequired();

            builder.Property(pr => pr.CustomerCode)
                .HasColumnName("CustomerCode")
                .HasMaxLength(40)
                .IsRequired();

            builder.Property(pr => pr.OfferCode)
                .HasColumnName("OfferCode")
                .HasMaxLength(40)
                .IsRequired();

            builder.Property(pr => pr.OfferAction)
                .HasColumnName("OfferAction")
                .HasMaxLength(40)
                .IsRequired();

            builder.Property(pr => pr.PricePerUnit)
             .HasColumnName("PricePerUnit")
             .HasPrecision(18, 8);

            builder.Property(pr => pr.IsMerchant)
                .HasColumnName("IsMerchant")
                .IsRequired();

            builder.Property(pr => pr.SourceTokenCode)
                .HasColumnName("SourceTokenCode")
                .HasMaxLength(12)
                .IsRequired();

            builder.Property(pr => pr.SourceTokenAmount)
                .HasColumnName("SourceTokenAmount")
                .HasPrecision(18, 8)
                .IsRequired();

            builder.Property(pr => pr.SourceTokenRemainingAmount)
                .HasColumnName("SourceTokenRemAmount")
                .HasPrecision(18, 8);

            builder.Property(pr => pr.DestinationTokenCode)
                .HasColumnName("DestinationTokenCode")
                .HasMaxLength(12)
                .IsRequired();

            builder.Property(pr => pr.DestinationTokenAmount)
                .HasColumnName("DestinationTokenAmount")
                .HasPrecision(18, 8)
                .IsRequired();

            builder.Property(pr => pr.DestinationTokenRemainingAmount)
                .HasColumnName("DestinationTokenRemAmount")
                .HasPrecision(18, 8);

            builder.Property(pr => pr.Status)
                .HasColumnName("OfferStatus")
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

            builder.OwnsOne(pr => pr.MerchantOfferSettings, o =>
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
                    o.ToTable("OfferParams");

                    o.WithOwner().HasForeignKey("OfferId");

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