using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizApi.Migrations
{
    /// <inheritdoc />
    public partial class DailyLeaderBoardAndHistorical : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Category",
                table: "QuizSessions",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "QuizSessions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "DailyLeaderboards",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FirstPlaceUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SecondPlaceUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ThirdPlaceUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyLeaderboards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyLeaderboards_Users_FirstPlaceUserId",
                        column: x => x.FirstPlaceUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DailyLeaderboards_Users_SecondPlaceUserId",
                        column: x => x.SecondPlaceUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DailyLeaderboards_Users_ThirdPlaceUserId",
                        column: x => x.ThirdPlaceUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserPodiumStats",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstPlaceCount = table.Column<int>(type: "int", nullable: false),
                    SecondPlaceCount = table.Column<int>(type: "int", nullable: false),
                    ThirdPlaceCount = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPodiumStats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPodiumStats_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPodiumStats_Users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuizSessions_Category_Date_TotalScore",
                table: "QuizSessions",
                columns: new[] { "Category", "Date", "TotalScore" });

            migrationBuilder.CreateIndex(
                name: "IX_DailyLeaderboards_Category_Date",
                table: "DailyLeaderboards",
                columns: new[] { "Category", "Date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DailyLeaderboards_FirstPlaceUserId",
                table: "DailyLeaderboards",
                column: "FirstPlaceUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyLeaderboards_SecondPlaceUserId",
                table: "DailyLeaderboards",
                column: "SecondPlaceUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyLeaderboards_ThirdPlaceUserId",
                table: "DailyLeaderboards",
                column: "ThirdPlaceUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPodiumStats_UserId_Category",
                table: "UserPodiumStats",
                columns: new[] { "UserId", "Category" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPodiumStats_UserId1",
                table: "UserPodiumStats",
                column: "UserId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyLeaderboards");

            migrationBuilder.DropTable(
                name: "UserPodiumStats");

            migrationBuilder.DropIndex(
                name: "IX_QuizSessions_Category_Date_TotalScore",
                table: "QuizSessions");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "QuizSessions");

            migrationBuilder.AlterColumn<string>(
                name: "Category",
                table: "QuizSessions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
