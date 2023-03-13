using System;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    [ExcludeFromCodeCoverage]
    public partial class Added_Boosts_to_UserProfiles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "Boosts",
                table: "Posts",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Boosts",
                table: "Posts");
        }
    }
}
