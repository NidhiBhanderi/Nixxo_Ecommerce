using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DtfStickerShop.API.Data;
using DtfStickerShop.API.Models.DTOs;
using DtfStickerShop.API.Models.Entities;
using DtfStickerShop.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DtfStickerShop.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            throw new InvalidOperationException("Email is already registered.");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            RoleId = 2 // Customer
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // give every new customer an empty cart
        _db.Carts.Add(new Cart { UserId = user.UserId });
        await _db.SaveChangesAsync();

        return await BuildAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _db.Users.Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user is null || !user.IsActive || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return await BuildAuthResponse(user);
    }

    public async Task<ForgotPasswordResponseDto> RequestPasswordResetAsync(ForgotPasswordDto dto)
    {
        const string message = "If an account exists for that email, a password-reset link has been created.";
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email.Trim() && u.IsActive);
        if (user is null) return new ForgotPasswordResponseDto(message);

        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        user.PasswordResetTokenHash = HashResetToken(token);
        user.PasswordResetTokenExpiresAt = DateTime.UtcNow.AddMinutes(30);
        await _db.SaveChangesAsync();

        var frontendUrl = (_config["FrontendUrl"] ?? "http://localhost:3000").TrimEnd('/');
        var resetUrl = frontendUrl + "/reset-password?token=" + token;
        return new ForgotPasswordResponseDto(message,
            _config["ASPNETCORE_ENVIRONMENT"] == "Development" ? resetUrl : null);
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 8)
            throw new InvalidOperationException("Use a reset link and a password of at least 8 characters.");

        var tokenHash = HashResetToken(dto.Token);
        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.PasswordResetTokenHash == tokenHash && u.PasswordResetTokenExpiresAt > DateTime.UtcNow);
        if (user is null) throw new UnauthorizedAccessException("This password-reset link is invalid or has expired.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.PasswordResetTokenHash = null;
        user.PasswordResetTokenExpiresAt = null;
        await _db.SaveChangesAsync();
    }

    private static string HashResetToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private async Task<AuthResponseDto> BuildAuthResponse(User user)
    {
        if (user.Role is null)
            user.Role = await _db.Roles.FindAsync(user.RoleId);

        var roleName = user.Role?.Name ?? "Customer";
        var minutes = int.Parse(_config["Jwt:AccessTokenMinutes"] ?? "60");
        var expires = DateTime.UtcNow.AddMinutes(minutes);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, roleName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return new AuthResponseDto(user.UserId, user.FullName, user.Email, roleName, tokenString, expires);
    }
}
