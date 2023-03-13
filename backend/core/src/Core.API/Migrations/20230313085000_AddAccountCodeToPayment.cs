using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountCodeToPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SenderAccountCode",
                table: "Payment",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SenderAccountCode",
                table: "Payment");
        }
    }
}
