using DtfStickerShop.API.Models.DTOs;
using DtfStickerShop.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DtfStickerShop.API.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    public ProductsController(IProductService productService) => _productService = productService;

    // GET /api/products?search=&categoryId=&sort=&page=&pageSize=
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetAll(
        [FromQuery] string? search, [FromQuery] int? categoryId, [FromQuery] string? sort,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _productService.GetProductsAsync(search, categoryId, sort, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductDto>> GetBySlug(string slug)
    {
        var product = await _productService.GetBySlugAsync(slug);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductDto>> Create(ProductCreateDto dto)
    {
        var created = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetBySlug), new { slug = created.Slug }, created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductDto>> Update(int id, ProductCreateDto dto)
    {
        var updated = await _productService.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _productService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    // Accepts an already-hosted image URL (e.g. from UploadController). Kept separate
    // so image storage strategy (local disk vs blob) can change without touching this shape.
    [HttpPost("{id:int}/images")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddImage(int id, [FromBody] AddImageDto dto)
    {
        var ok = await _productService.AddImageAsync(id, dto.ImageUrl, dto.IsPrimary);
        return ok ? Ok() : NotFound();
    }
}

public record AddImageDto(string ImageUrl, bool IsPrimary);
