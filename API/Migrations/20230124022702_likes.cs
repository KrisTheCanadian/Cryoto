using System;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    [ExcludeFromCodeCoverage]
    public partial class likes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "Celebrations",
                table: "Posts",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string[]>(
                name: "Claps",
                table: "Posts",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string[]>(
                name: "Hearts",
                table: "Posts",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string[]>(
                name: "UsersWhoReacted",
                table: "Posts",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Celebrations",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "Claps",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "Hearts",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "UsersWhoReacted",
                table: "Posts");
        }
    }
}
