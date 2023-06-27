using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.API.Migrations
{
    /// <inheritdoc />
    public partial class AddSenderDestinationRemaningAmount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PaidAmount",
                table: "Offer",
                newName: "SourceTokenRemAmount");

            migrationBuilder.AddColumn<decimal>(
                name: "DestinationTokenRemAmount",
                table: "Offer",
                type: "decimal(18,8)",
                precision: 18,
                scale: 8,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PricePerUnit",
                table: "Offer",
                type: "decimal(18,8)",
                precision: 18,
                scale: 8,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DestinationTokenRemAmount",
                table: "Offer");

            migrationBuilder.DropColumn(
                name: "PricePerUnit",
                table: "Offer");

            migrationBuilder.RenameColumn(
                name: "SourceTokenRemAmount",
                table: "Offer",
                newName: "PaidAmount");
        }
    }
}
