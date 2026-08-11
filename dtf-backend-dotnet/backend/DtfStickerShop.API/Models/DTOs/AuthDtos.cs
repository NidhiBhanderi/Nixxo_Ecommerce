namespace DtfStickerShop.API.Models.DTOs;

public record RegisterDto(string FullName, string Email, string Password, string? PhoneNumber);
public record LoginDto(string Email, string Password);

public record AuthResponseDto(int UserId, string FullName, string Email, string Role, string Token, DateTime ExpiresAt);

public record CategoryDto(int CategoryId, string Name, string Slug, int? ParentCategoryId, bool IsActive);
public record CategoryCreateDto(string Name, string Slug, int? ParentCategoryId);

public record ProductDto(
    int ProductId, string Name, string Slug, string? Description, int CategoryId,
    string CategoryName, decimal Price, decimal? DiscountPrice, string SKU,
    int StockQuantity, string? Size, bool IsFeatured, List<string> ImageUrls);

public record ProductCreateDto(
    string Name, string Slug, string? Description, int CategoryId,
    decimal Price, decimal? DiscountPrice, string SKU, int StockQuantity,
    string? Size, bool IsFeatured);

public record PagedResult<T>(List<T> Items, int TotalCount, int Page, int PageSize);
