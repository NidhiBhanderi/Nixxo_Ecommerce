using DtfStickerShop.API.Data;
using DtfStickerShop.API.Models.DTOs;
using DtfStickerShop.API.Models.Entities;
using DtfStickerShop.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DtfStickerShop.API.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;
    public ProductService(AppDbContext db) => _db = db;

    public async Task<PagedResult<ProductDto>> GetProductsAsync(
        string? search, int? categoryId, string? sort, int page, int pageSize)
    {
        var query = _db.Products.Include(p => p.Category).Include(p => p.Images)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search) || (p.Description != null && p.Description.Contains(search)));

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        query = sort switch
        {
            "price_asc" => query.OrderBy(p => p.Price),
            "price_desc" => query.OrderByDescending(p => p.Price),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.CreatedAt)
        };

        var total = await query.CountAsync();
        page = page < 1 ? 1 : page;
        pageSize = pageSize is < 1 or > 100 ? 20 : pageSize;

        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<ProductDto>(items.Select(ToDto).ToList(), total, page, pageSize);
    }

    public async Task<ProductDto?> GetBySlugAsync(string slug)
    {
        var p = await _db.Products.Include(x => x.Category).Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive);
        return p is null ? null : ToDto(p);
    }

    public async Task<ProductDto> CreateAsync(ProductCreateDto dto)
    {
        var entity = new Product
        {
            Name = dto.Name,
            Slug = dto.Slug,
            Description = dto.Description,
            CategoryId = dto.CategoryId,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            SKU = dto.SKU,
            StockQuantity = dto.StockQuantity,
            Size = dto.Size,
            IsFeatured = dto.IsFeatured
        };
        _db.Products.Add(entity);
        await _db.SaveChangesAsync();
        await _db.Entry(entity).Reference(p => p.Category).LoadAsync();
        return ToDto(entity);
    }

    public async Task<ProductDto?> UpdateAsync(int id, ProductCreateDto dto)
    {
        var entity = await _db.Products.Include(p => p.Category).Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.ProductId == id);
        if (entity is null) return null;

        entity.Name = dto.Name;
        entity.Slug = dto.Slug;
        entity.Description = dto.Description;
        entity.CategoryId = dto.CategoryId;
        entity.Price = dto.Price;
        entity.DiscountPrice = dto.DiscountPrice;
        entity.SKU = dto.SKU;
        entity.StockQuantity = dto.StockQuantity;
        entity.Size = dto.Size;
        entity.IsFeatured = dto.IsFeatured;
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToDto(entity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _db.Products.FindAsync(id);
        if (entity is null) return false;
        entity.IsActive = false; // soft delete keeps order history intact
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddImageAsync(int productId, string imageUrl, bool isPrimary)
    {
        var product = await _db.Products.FindAsync(productId);
        if (product is null) return false;

        if (isPrimary)
        {
            var existing = await _db.ProductImages.Where(i => i.ProductId == productId).ToListAsync();
            foreach (var img in existing) img.IsPrimary = false;
        }

        _db.ProductImages.Add(new ProductImage
        {
            ProductId = productId,
            ImageUrl = imageUrl,
            IsPrimary = isPrimary
        });
        await _db.SaveChangesAsync();
        return true;
    }

    private static ProductDto ToDto(Product p) => new(
        p.ProductId, p.Name, p.Slug, p.Description, p.CategoryId,
        p.Category?.Name ?? "", p.Price, p.DiscountPrice, p.SKU,
        p.StockQuantity, p.Size, p.IsFeatured,
        p.Images.OrderBy(i => i.DisplayOrder).Select(i => i.ImageUrl).ToList());
}
