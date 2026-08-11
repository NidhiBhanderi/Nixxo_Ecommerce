using DtfStickerShop.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace DtfStickerShop.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(p => p.Slug).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(p => p.SKU).IsUnique();
        modelBuilder.Entity<Category>().HasIndex(c => c.Slug).IsUnique();
        modelBuilder.Entity<Order>().HasIndex(o => o.OrderNumber).IsUnique();
        modelBuilder.Entity<Cart>().HasIndex(c => c.UserId).IsUnique();
        modelBuilder.Entity<Payment>().HasIndex(p => p.OrderId).IsUnique();

        modelBuilder.Entity<Product>()
            .Property(p => p.Price).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<Product>()
            .Property(p => p.DiscountPrice).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<CartItem>()
            .Property(p => p.UnitPriceSnapshot).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<Order>()
            .Property(p => p.Subtotal).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<Order>()
            .Property(p => p.ShippingFee).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<Order>()
            .Property(p => p.Tax).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<Order>()
            .Property(p => p.Total).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<OrderDetail>()
            .Property(p => p.UnitPrice).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<OrderDetail>()
            .Property(p => p.LineTotal).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount).HasColumnType("decimal(10,2)");

        modelBuilder.Entity<Category>()
            .HasOne(c => c.ParentCategory)
            .WithMany()
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.ShippingAddress)
            .WithMany()
            .HasForeignKey(o => o.ShippingAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderDetail>()
            .HasOne(od => od.Product)
            .WithMany()
            .HasForeignKey(od => od.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany()
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Role>().HasData(
            new Role { RoleId = 1, Name = "Admin" },
            new Role { RoleId = 2, Name = "Customer" }
        );
    }
}
