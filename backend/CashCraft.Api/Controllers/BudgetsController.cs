using System;
using System.Linq;
using System.Threading.Tasks;
using CashCraft.Api.Application.DTOs;
using CashCraft.Api.Application.Mapping;
using CashCraft.Api.Domain.Entities;
using CashCraft.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CashCraft.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public BudgetsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // ===== PLANS =====
        
        [HttpGet("plans")]
        [Authorize]
        public async Task<IActionResult> GetPlans()
        {
            try
            {
                Console.WriteLine("=== GetPlans called ===");
                
                var userId = GetUserIdFromToken();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Invalid user ID in token" });
                }

                Console.WriteLine($"✅ User authenticated: {userId}");

                var plans = await _db.BudgetPlans
                    .Include(p => p.Categories)
                    .Where(p => p.UserId == userId.Value)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                Console.WriteLine($"📊 Found {plans.Count} plans for user");

                var planDtos = plans.Select(p => p.ToDto()).ToList();
                return Ok(planDtos);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ GetPlans error: {ex.Message}");
                return StatusCode(500, new { message = "Failed to get plans", error = ex.Message });
            }
        }

        [HttpPost("plans")]
        [Authorize]
        public async Task<IActionResult> CreatePlan([FromBody] CreateBudgetPlanDto dto)
        {
            try
            {
                Console.WriteLine("=== CreatePlan called ===");
                Console.WriteLine($"Request body: {System.Text.Json.JsonSerializer.Serialize(dto)}");
                
                // Validate input
                if (dto == null)
                {
                    Console.WriteLine("❌ Request body is null");
                    return BadRequest(new { message = "Request body is required" });
                }

                if (string.IsNullOrWhiteSpace(dto.Name))
                {
                    Console.WriteLine("❌ Plan name is required");
                    return BadRequest(new { message = "Plan name is required" });
                }

                // Get user ID from token
                var userId = GetUserIdFromToken();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Invalid user ID in token" });
                }

                Console.WriteLine($"✅ User authenticated: {userId}");

                // Check if user exists
                var user = await _db.Users.FindAsync(userId.Value);
                if (user == null)
                {
                    Console.WriteLine("❌ User not found in database");
                    return Unauthorized(new { message = "User not found" });
                }

                // Create the plan
                var plan = new BudgetPlan
                {
                    Id = Guid.NewGuid(),
                    UserId = userId.Value,
                    Name = dto.Name.Trim(),
                    Type = dto.Type ?? "monthly",
                    Currency = dto.Currency ?? "EGP",
                    CreatedAt = dto.CreatedAt ?? DateTime.UtcNow,
                    Categories = new List<BudgetCategory>()
                };

                Console.WriteLine($"📝 Creating plan: {plan.Name} (ID: {plan.Id})");

                // Save to database
                _db.BudgetPlans.Add(plan);
                await _db.SaveChangesAsync();

                Console.WriteLine($"✅ Plan created successfully! Plan ID: {plan.Id}");

                // Return the created plan
                var response = plan.ToCreateResponseDto();
                return CreatedAtAction(nameof(GetPlans), new { id = plan.Id }, response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ CreatePlan error: {ex.Message}");
                Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Failed to create plan", error = ex.Message });
            }
        }

        [HttpGet("plans/{planId:guid}")]
        [Authorize]
        public async Task<IActionResult> GetPlan(Guid planId)
        {
            try
            {
                Console.WriteLine($"=== GetPlan called for ID: {planId} ===");
                
                var userId = GetUserIdFromToken();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Invalid user ID in token" });
                }

                var plan = await _db.BudgetPlans
                    .Include(p => p.Categories)
                    .FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId.Value);

                if (plan == null)
                {
                    return NotFound(new { message = "Plan not found" });
                }

                return Ok(plan.ToDto());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ GetPlan error: {ex.Message}");
                return StatusCode(500, new { message = "Failed to get plan", error = ex.Message });
            }
        }

        // ===== CATEGORIES =====

        [HttpGet("plans/{planId:guid}/categories")]
        [Authorize]
        public async Task<IActionResult> GetCategories(Guid planId)
        {
            try
            {
                Console.WriteLine($"=== GetCategories called for plan: {planId} ===");
                
                var userId = GetUserIdFromToken();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Invalid user ID in token" });
                }

                // Verify plan belongs to user
                var plan = await _db.BudgetPlans
                    .Include(p => p.Categories)
                    .FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId.Value);

                if (plan == null)
                {
                    return NotFound(new { message = "Plan not found" });
                }

                var categoryDtos = plan.Categories.Select(c => c.ToDto()).ToList();
                return Ok(categoryDtos);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ GetCategories error: {ex.Message}");
                return StatusCode(500, new { message = "Failed to get categories", error = ex.Message });
            }
        }

        [HttpPost("plans/{planId:guid}/categories")]
        [Authorize]
        public async Task<IActionResult> CreateCategory(Guid planId, [FromBody] CreateBudgetCategoryDto dto)
        {
            try
            {
                Console.WriteLine($"=== CreateCategory called for plan: {planId} ===");
                Console.WriteLine($"Category data: {System.Text.Json.JsonSerializer.Serialize(dto)}");
                
                if (dto == null)
                {
                    return BadRequest(new { message = "Request body is required" });
                }

                if (string.IsNullOrWhiteSpace(dto.Name))
                {
                    return BadRequest(new { message = "Category name is required" });
                }

                if (dto.BudgetedAmount <= 0)
                {
                    return BadRequest(new { message = "Budget amount must be greater than 0" });
                }

                var userId = GetUserIdFromToken();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Invalid user ID in token" });
                }

                // Verify plan belongs to user
                var plan = await _db.BudgetPlans
                    .Include(p => p.Categories)
                    .FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId.Value);

                if (plan == null)
                {
                    return NotFound(new { message = "Plan not found" });
                }

                var category = new BudgetCategory
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name.Trim(),
                    ColorHex = dto.ColorHex ?? "#3b82f6",
                    BudgetedAmount = dto.BudgetedAmount,
                    BudgetPlanId = planId,
                    CreatedAt = DateTime.UtcNow
                };

                _db.BudgetCategories.Add(category);
                await _db.SaveChangesAsync();

                Console.WriteLine($"✅ Category created: {category.Name} (ID: {category.Id})");

                var response = category.ToCreateResponseDto();
                return Created($"api/budgets/plans/{planId}/categories/{category.Id}", response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ CreateCategory error: {ex.Message}");
                return StatusCode(500, new { message = "Failed to create category", error = ex.Message });
            }
        }

        // ===== EXPENSES =====

        [HttpGet("categories/{categoryId:guid}/expenses")]
        [Authorize]
        public async Task<IActionResult> GetExpenses(Guid categoryId)
        {
            try
            {
                Console.WriteLine($"=== GetExpenses called for category: {categoryId} ===");
                
                var userId = GetUserIdFromToken();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Invalid user ID in token" });
                }

                // Verify category belongs to user's plan
                var category = await _db.BudgetCategories
                    .Include(c => c.BudgetPlan)
                    .FirstOrDefaultAsync(c => c.Id == categoryId && c.BudgetPlan.UserId == userId.Value);

                if (category == null)
                {
                    return NotFound(new { message = "Category not found" });
                }

                var expenses = await _db.Expenses
                    .Where(e => e.BudgetCategoryId == categoryId)
                    .OrderByDescending(e => e.Date)
                    .ToListAsync();

                var expenseDtos = expenses.Select(e => e.ToDto()).ToList();
                return Ok(expenseDtos);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ GetExpenses error: {ex.Message}");
                return StatusCode(500, new { message = "Failed to get expenses", error = ex.Message });
            }
        }

        [HttpPost("categories/{categoryId:guid}/expenses")]
        [Authorize]
        public async Task<IActionResult> CreateExpense(Guid categoryId, [FromBody] CreateExpenseDto dto)
        {
            try
            {
                Console.WriteLine($"=== CreateExpense called for category: {categoryId} ===");
                Console.WriteLine($"Expense data: {System.Text.Json.JsonSerializer.Serialize(dto)}");
                
                if (dto == null)
                {
                    return BadRequest(new { message = "Request body is required" });
                }

                if (dto.Amount <= 0)
                {
                    return BadRequest(new { message = "Amount must be greater than 0" });
                }

                var userId = GetUserIdFromToken();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Invalid user ID in token" });
                }

                // Verify category belongs to user's plan
                var category = await _db.BudgetCategories
                    .Include(c => c.BudgetPlan)
                    .FirstOrDefaultAsync(c => c.Id == categoryId && c.BudgetPlan.UserId == userId.Value);

                if (category == null)
                {
                    return NotFound(new { message = "Category not found" });
                }

                var expense = new Expense
                {
                    Id = Guid.NewGuid(),
                    BudgetCategoryId = categoryId,
                    Amount = dto.Amount,
                    Description = dto.Description?.Trim() ?? "",
                    Date = dto.Date,
                    CreatedAt = DateTime.UtcNow
                };

                _db.Expenses.Add(expense);
                await _db.SaveChangesAsync();

                Console.WriteLine($"✅ Expense created: ${expense.Amount} - {expense.Description}");

                var response = expense.ToCreateResponseDto();
                return Created($"api/budgets/categories/{categoryId}/expenses/{expense.Id}", response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ CreateExpense error: {ex.Message}");
                return StatusCode(500, new { message = "Failed to create expense", error = ex.Message });
            }
        }

        // ===== HELPER METHODS =====

        private Guid? GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return null;
            }
            return userId;
        }

        // ===== HEALTH CHECK =====

        [HttpGet("health")]
        [AllowAnonymous]
        public IActionResult Health()
        {
            return Ok(new { 
                message = "Budgets controller is healthy",
                timestamp = DateTime.UtcNow,
                endpoints = new[] {
                    "GET /api/budgets/plans",
                    "POST /api/budgets/plans", 
                    "GET /api/budgets/plans/{id}",
                    "GET /api/budgets/plans/{id}/categories",
                    "POST /api/budgets/plans/{id}/categories",
                    "GET /api/budgets/categories/{id}/expenses",
                    "POST /api/budgets/categories/{id}/expenses"
                }
            });
        }
    }
}


