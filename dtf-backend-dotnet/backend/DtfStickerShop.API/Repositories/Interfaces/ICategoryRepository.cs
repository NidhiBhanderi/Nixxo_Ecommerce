using DtfStickerShop.API.Models.Entities;

namespace DtfStickerShop.API.Repositories.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetActiveCategoriesAsync();
    Task<Category?> GetByIdAsync(int id);
    Task AddAsync(Category category);
    Task SaveChangesAsync();
}
