using DtfStickerShop.API.Models.Entities;

namespace DtfStickerShop.API.Repositories.Interfaces;

public interface IProductRepository
{
    Task<(List<Product> Items, int TotalCount)> GetProductsAsync(
        string? search, int? categoryId, string? sort, int page, int pageSize);

    Task<Product?> GetBySlugAsync(string slug);
    Task<Product?> GetByIdAsync(int id);
    Task<Product> AddAsync(Product product);
    Task AddImageAsync(ProductImage image);
    Task<List<ProductImage>> GetImagesAsync(int productId);
    Task SaveChangesAsync();
}
