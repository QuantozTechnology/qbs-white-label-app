// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PaymentRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CustomerCode = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    PublicKey = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    TokenCode = table.Column<string>(type: "nvarchar(12)", maxLength: 12, nullable: false),
                    RequestedAmount = table.Column<decimal>(type: "decimal(18,8)", precision: 18, scale: 8, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_PaymentRequest", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Callback",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    DestinationUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    PaymentRequestId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Callback", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Callback_PaymentRequest_PaymentRequestId",
                        column: x => x.PaymentRequestId,
                        principalTable: "PaymentRequest",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SenderPublicKey = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    ReceiverPublicKey = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    SenderName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ReceiverName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TokenCode = table.Column<string>(type: "nvarchar(12)", maxLength: 12, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,8)", precision: 18, scale: 8, nullable: false),
                    Memo = table.Column<string>(type: "nvarchar(28)", maxLength: 28, nullable: true),
                    TransactionCode = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    PaymentRequestId = table.Column<int>(type: "int", nullable: true),
                    CreatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedOn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    PaymentRequestId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payment_PaymentRequest_PaymentRequestId",
                        column: x => x.PaymentRequestId,
                        principalTable: "PaymentRequest",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Payment_PaymentRequest_PaymentRequestId1",
                        column: x => x.PaymentRequestId1,
                        principalTable: "PaymentRequest",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PaymentRequestParams",
                columns: table => new
                {
                    PaymentRequestId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentRequestParams", x => new { x.PaymentRequestId, x.Id });
                    table.ForeignKey(
                        name: "FK_PaymentRequestParams_PaymentRequest_PaymentRequestId",
                        column: x => x.PaymentRequestId,
                        principalTable: "PaymentRequest",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Callback_PaymentRequestId",
                table: "Callback",
                column: "PaymentRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_PaymentRequestId",
                table: "Payment",
                column: "PaymentRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_PaymentRequestId1",
                table: "Payment",
                column: "PaymentRequestId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Callback");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "PaymentRequestParams");

            migrationBuilder.DropTable(
                name: "PaymentRequest");
        }
    }
}
