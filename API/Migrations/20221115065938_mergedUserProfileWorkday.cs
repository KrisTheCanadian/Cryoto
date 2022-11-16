using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class mergedUserProfileWorkday : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BusinessTitle",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CountryReference",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CountryReferenceTwoLetter",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Fax",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManagerReference",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Mobile",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryWorkTelephone",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupervisoryOrganization",
                table: "UserProfiles",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Company",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "CountryReference",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "CountryReferenceTwoLetter",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "Fax",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "ManagerReference",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "Mobile",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PrimaryWorkTelephone",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "SupervisoryOrganization",
                table: "UserProfiles");

            migrationBuilder.CreateTable(
                name: "UserProfileModel",
                columns: table => new
                {
                    TempId1 = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.UniqueConstraint("AK_UserProfileModel_TempId1", x => x.TempId1);
                });
        }
    }
}
