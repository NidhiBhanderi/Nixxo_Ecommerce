using DtfStickerShop.API.Models.DTOs;
using DtfStickerShop.API.Models.Entities;
using DtfStickerShop.API.Repositories.Interfaces;
using DtfStickerShop.API.Services.Interfaces;

namespace DtfStickerShop.API.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    public CategoryService(ICategoryRepository categoryRepository) => _categoryRepository = categoryRepository;

    public async Task<List<CategoryDto>> GetAllAsync() =>
        (await _categoryRepository.GetActiveCategoriesAsync())
            .Select(c => new CategoryDto(c.CategoryId, c.Name, c.Slug, c.ParentCategoryId, c.IsActive))
            .ToList();

    public async Task<CategoryDto> CreateAsync(CategoryCreateDto dto)
    {
        var entity = new Category { Name = dto.Name, Slug = dto.Slug, ParentCategoryId = dto.ParentCategoryId };
        await _categoryRepository.AddAsync(entity);
        await _categoryRepository.SaveChangesAsync();
        return new CategoryDto(entity.CategoryId, entity.Name, entity.Slug, entity.ParentCategoryId, entity.IsActive);
    }

    public async Task<CategoryDto?> UpdateAsync(int id, CategoryCreateDto dto)
    {
        var entity = await _categoryRepository.GetByIdAsync(id);
        if (entity is null) return null;
        entity.Name = dto.Name;
        entity.Slug = dto.Slug;
        entity.ParentCategoryId = dto.ParentCategoryId;
        await _categoryRepository.SaveChangesAsync();
        return new CategoryDto(entity.CategoryId, entity.Name, entity.Slug, entity.ParentCategoryId, entity.IsActive);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _categoryRepository.GetByIdAsync(id);
        if (entity is null) return false;
        entity.IsActive = false;
        await _categoryRepository.SaveChangesAsync();
        return true;
    }
}
