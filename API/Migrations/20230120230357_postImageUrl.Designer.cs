﻿// <auto-generated />
using System;
using API.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20230120230357_postImageUrl")]
    partial class postImageUrl
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("API.Models.Notifications.Notification", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<double>("Amount")
                        .HasColumnType("double precision");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ReceiverId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("Seen")
                        .HasColumnType("boolean");

                    b.Property<string>("SenderId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("API.Models.Posts.PostModel", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("Author")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("Coins")
                        .HasColumnType("numeric(20,0)");

                    b.Property<DateTimeOffset>("CreatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsTransactable")
                        .HasColumnType("boolean");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PostType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string[]>("Recipients")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.Property<string[]>("Tags")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.HasKey("Id");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("API.Models.Transactions.TransactionModel", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ReceiverOId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ReceiverWalletType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SenderOId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SenderWalletType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("Timestamp")
                        .HasColumnType("timestamp with time zone");

                    b.Property<double>("TokenAmount")
                        .HasColumnType("double precision");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Transactions");
                });

            modelBuilder.Entity("API.Models.Users.UserProfileModel", b =>
                {
                    b.Property<string>("OId")
                        .HasColumnType("text");

                    b.Property<string>("BusinessTitle")
                        .HasColumnType("text");

                    b.Property<string>("Company")
                        .HasColumnType("text");

                    b.Property<string>("CountryReference")
                        .HasColumnType("text");

                    b.Property<string>("CountryReferenceTwoLetter")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("EmailNotifications")
                        .HasColumnType("boolean");

                    b.Property<string>("Fax")
                        .HasColumnType("text");

                    b.Property<string>("Language")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ManagerReference")
                        .HasColumnType("text");

                    b.Property<string>("Mobile")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PostalCode")
                        .HasColumnType("text");

                    b.Property<string>("PrimaryWorkTelephone")
                        .HasColumnType("text");

                    b.Property<string[]>("Roles")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.Property<string>("SupervisoryOrganization")
                        .HasColumnType("text");

                    b.HasKey("OId");

                    b.ToTable("UserProfiles");
                });

            modelBuilder.Entity("API.Models.Users.WalletModel", b =>
                {
                    b.Property<string>("PublicKey")
                        .HasColumnType("text");

                    b.Property<string>("OId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("TokenBalance")
                        .HasColumnType("double precision");

                    b.Property<string>("Wallet")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("WalletType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("PublicKey");

                    b.HasIndex("OId");

                    b.ToTable("Wallets");
                });

            modelBuilder.Entity("API.Models.Users.WalletModel", b =>
                {
                    b.HasOne("API.Models.Users.UserProfileModel", "UserProfileModel")
                        .WithMany()
                        .HasForeignKey("OId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserProfileModel");
                });
#pragma warning restore 612, 618
        }
    }
}
