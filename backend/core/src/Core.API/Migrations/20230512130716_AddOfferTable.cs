using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.API.Migrations
{
    /// <inheritdoc />
    public partial class AddOfferTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OfferId",
                table: "Payment",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OfferId",
                table: "Callback",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Offer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OfferCode = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CustomerCode = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    PublicKey = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    SourceTokenCode = table.Column<string>(type: "nvarchar(12)", maxLength: 12, nullable: false),
                    SourceTokenAmount = table.Column<decimal>(type: "decimal(18,8)", precision: 18, scale: 8, nullable: false),
                    DestinationTokenCode = table.Column<string>(type: "nvarchar(12)", maxLength: 12, nullable: false),
                    DestinationTokenAmount = table.Column<decimal>(type: "decimal(18,8)", precision: 18, scale: 8, nullable: false),
                    PaidAmount = table.Column<decimal>(type: "decimal(18,8)", precision: 18, scale: 8, nullable: true),
                    OfferAction = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    OfferStatus = table.Column<int>(type: "int", nullable: false),
                    IsMerchant = table.Column<bool>(type: "bit", nullable: false),
                    IsOneOffPayment = table.Column<bool>(type: "bit", nullable: false),
                    PayerCanChangeRequestedAmount = table.Column<bool>(type: "bit", nullable: false),
                    ExpiresOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Memo = table.Column<string>(type: "nvarchar(28)", maxLength: 28, nullable: true),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CallbackUrl = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ReturnUrl = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offer", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OfferParams",
                columns: table => new
                {
                    OfferId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OfferParams", x => new { x.OfferId, x.Id });
                    table.ForeignKey(
                        name: "FK_OfferParams_Offer_OfferId",
                        column: x => x.OfferId,
                        principalTable: "Offer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payment_OfferId",
                table: "Payment",
                column: "OfferId");

            migrationBuilder.CreateIndex(
                name: "IX_Callback_OfferId",
                table: "Callback",
                column: "OfferId");

            migrationBuilder.AddForeignKey(
                name: "FK_Callback_Offer_OfferId",
                table: "Callback",
                column: "OfferId",
                principalTable: "Offer",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Offer_OfferId",
                table: "Payment",
                column: "OfferId",
                principalTable: "Offer",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Callback_Offer_OfferId",
                table: "Callback");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Offer_OfferId",
                table: "Payment");

            migrationBuilder.DropTable(
                name: "OfferParams");

            migrationBuilder.DropTable(
                name: "Offer");

            migrationBuilder.DropIndex(
                name: "IX_Payment_OfferId",
                table: "Payment");

            migrationBuilder.DropIndex(
                name: "IX_Callback_OfferId",
                table: "Callback");

            migrationBuilder.DropColumn(
                name: "OfferId",
                table: "Payment");

            migrationBuilder.DropColumn(
                name: "OfferId",
                table: "Callback");
        }
    }
}
