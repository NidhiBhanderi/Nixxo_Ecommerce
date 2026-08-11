using DtfStickerShop.API.Models.DTOs;

namespace DtfStickerShop.API.Services.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductDto>> GetProductsAsync(string? search, int? categoryId, string? sort, int page, int pageSize);
    Task<ProductDto?> GetBySlugAsync(string slug);
    Task<ProductDto> CreateAsync(ProductCreateDto dto);
    Task<ProductDto?> UpdateAsync(int id, ProductCreateDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> AddImageAsync(int productId, string imageUrl, bool isPrimary);
}

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();
    Task<CategoryDto> CreateAsync(CategoryCreateDto dto);
    Task<CategoryDto?> UpdateAsync(int id, CategoryCreateDto dto);
    Task<bool> DeleteAsync(int id);
}
