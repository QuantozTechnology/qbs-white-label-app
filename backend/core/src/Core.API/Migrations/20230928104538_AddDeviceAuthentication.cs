using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDeviceAuthentication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomerOTPKeyStorage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerCode = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    OTPKey = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerOTPKeyStorage", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomerDevicePublicKeys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicKey = table.Column<string>(type: "nvarchar(max)", maxLength: 4096, nullable: false),
                    CustomerOTPKeyStoreId = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerDevicePublicKeys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerDevicePublicKeys_CustomerOTPKeyStorage_CustomerOTPKeyStoreId",
                        column: x => x.CustomerOTPKeyStoreId,
                        principalTable: "CustomerOTPKeyStorage",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerDevicePublicKeys_CustomerOTPKeyStoreId",
                table: "CustomerDevicePublicKeys",
                column: "CustomerOTPKeyStoreId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerDevicePublicKeys");

            migrationBuilder.DropTable(
                name: "CustomerOTPKeyStorage");
        }
    }
}
