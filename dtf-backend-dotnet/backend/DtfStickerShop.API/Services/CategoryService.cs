using DtfStickerShop.API.Data;
using DtfStickerShop.API.Models.DTOs;
using DtfStickerShop.API.Models.Entities;
using DtfStickerShop.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DtfStickerShop.API.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _db;
    public CategoryService(AppDbContext db) => _db = db;

    public async Task<List<CategoryDto>> GetAllAsync() =>
        await _db.Categories.Where(c => c.IsActive)
            .Select(c => new CategoryDto(c.CategoryId, c.Name, c.Slug, c.ParentCategoryId, c.IsActive))
            .ToListAsync();

    public async Task<CategoryDto> CreateAsync(CategoryCreateDto dto)
    {
        var entity = new Category { Name = dto.Name, Slug = dto.Slug, ParentCategoryId = dto.ParentCategoryId };
        _db.Categories.Add(entity);
        await _db.SaveChangesAsync();
        return new CategoryDto(entity.CategoryId, entity.Name, entity.Slug, entity.ParentCategoryId, entity.IsActive);
    }

    public async Task<CategoryDto?> UpdateAsync(int id, CategoryCreateDto dto)
    {
        var entity = await _db.Categories.FindAsync(id);
        if (entity is null) return null;
        entity.Name = dto.Name;
        entity.Slug = dto.Slug;
        entity.ParentCategoryId = dto.ParentCategoryId;
        await _db.SaveChangesAsync();
        return new CategoryDto(entity.CategoryId, entity.Name, entity.Slug, entity.ParentCategoryId, entity.IsActive);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _db.Categories.FindAsync(id);
        if (entity is null) return false;
        entity.IsActive = false;
        await _db.SaveChangesAsync();
        return true;
    }
}
