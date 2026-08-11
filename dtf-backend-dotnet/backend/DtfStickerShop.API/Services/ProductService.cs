using DtfStickerShop.API.Models.DTOs;
using DtfStickerShop.API.Models.Entities;
using DtfStickerShop.API.Repositories.Interfaces;
using DtfStickerShop.API.Services.Interfaces;

namespace DtfStickerShop.API.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository) => _productRepository = productRepository;

    public async Task<PagedResult<ProductDto>> GetProductsAsync(
        string? search, int? categoryId, string? sort, int page, int pageSize)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize is < 1 or > 100 ? 20 : pageSize;

        var (items, total) = await _productRepository.GetProductsAsync(search, categoryId, sort, page, pageSize);
        return new PagedResult<ProductDto>(items.Select(ToDto).ToList(), total, page, pageSize);
    }

    public async Task<ProductDto?> GetBySlugAsync(string slug)
    {
        var product = await _productRepository.GetBySlugAsync(slug);
        return product is null ? null : ToDto(product);
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

        var created = await _productRepository.AddAsync(entity);
        return ToDto(created);
    }

    public async Task<ProductDto?> UpdateAsync(int id, ProductCreateDto dto)
    {
        var entity = await _productRepository.GetByIdAsync(id);
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

        await _productRepository.SaveChangesAsync();
        return ToDto(entity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _productRepository.GetByIdAsync(id);
        if (entity is null) return false;

        entity.IsActive = false; // soft delete keeps order history intact
        await _productRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddImageAsync(int productId, string imageUrl, bool isPrimary)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null) return false;

        if (isPrimary)
        {
            var existing = await _productRepository.GetImagesAsync(productId);
            foreach (var img in existing) img.IsPrimary = false;
        }

        await _productRepository.AddImageAsync(new ProductImage
        {
            ProductId = productId,
            ImageUrl = imageUrl,
            IsPrimary = isPrimary
        });
        await _productRepository.SaveChangesAsync();
        return true;
    }

    private static ProductDto ToDto(Product p) => new(
        p.ProductId, p.Name, p.Slug, p.Description, p.CategoryId,
        p.Category?.Name ?? string.Empty, p.Price, p.DiscountPrice, p.SKU,
        p.StockQuantity, p.Size, p.IsFeatured,
        p.Images.OrderBy(i => i.DisplayOrder).Select(i => i.ImageUrl).ToList());
}
