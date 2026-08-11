using DtfStickerShop.API.Data;
using DtfStickerShop.API.Models.Entities;
using DtfStickerShop.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DtfStickerShop.API.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _db;

    public ProductRepository(AppDbContext db) => _db = db;

    public async Task<(List<Product> Items, int TotalCount)> GetProductsAsync(
        string? search, int? categoryId, string? sort, int page, int pageSize)
    {
        var query = _db.Products.Include(p => p.Category).Include(p => p.Images)
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search) ||
                (p.Description != null && p.Description.Contains(search)));

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
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }

    public async Task<Product?> GetBySlugAsync(string slug) =>
        await _db.Products.Include(p => p.Category).Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive);

    public async Task<Product?> GetByIdAsync(int id) =>
        await _db.Products.Include(p => p.Category).Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.ProductId == id);

    public async Task<Product> AddAsync(Product product)
    {
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        await _db.Entry(product).Reference(p => p.Category).LoadAsync();
        return product;
    }

    public Task AddImageAsync(ProductImage image)
    {
        _db.ProductImages.Add(image);
        return Task.CompletedTask;
    }

    public async Task<List<ProductImage>> GetImagesAsync(int productId) =>
        await _db.ProductImages.Where(pi => pi.ProductId == productId).ToListAsync();

    public async Task SaveChangesAsync() => await _db.SaveChangesAsync();
}
