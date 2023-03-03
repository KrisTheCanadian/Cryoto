using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    [ExcludeFromCodeCoverage]
    public partial class sideBarMenu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_StartDate",
                table: "UserProfiles",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_Author",
                table: "Posts",
                column: "Author");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_CreatedDate",
                table: "Posts",
                column: "CreatedDate");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserProfiles_StartDate",
                table: "UserProfiles");

            migrationBuilder.DropIndex(
                name: "IX_Posts_Author",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_CreatedDate",
                table: "Posts");
        }
    }
}
