using DtfStickerShop.API.Data;
using DtfStickerShop.API.Models.Entities;
using DtfStickerShop.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DtfStickerShop.API.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _db;

    public CategoryRepository(AppDbContext db) => _db = db;

    public async Task<List<Category>> GetActiveCategoriesAsync() =>
        await _db.Categories.Where(c => c.IsActive).ToListAsync();

    public async Task<Category?> GetByIdAsync(int id) =>
        await _db.Categories.FindAsync(id);

    public Task AddAsync(Category category)
    {
        _db.Categories.Add(category);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() => await _db.SaveChangesAsync();
}
