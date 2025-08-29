using CashCraft.Api.Application.DTOs;
using CashCraft.Api.Application.Mapping;
using CashCraft.Api.Domain.Entities;
using CashCraft.Api.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Api.Endpoints
{
    public static class BudgetEndpoints
    {
        public static IEndpointRouteBuilder MapBudgetEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/budgets");

            // In this MVP, we assume a single demo user and do not require auth yet
            group.MapGet("", async (ApplicationDbContext db) =>
            {
                var plans = await db.BudgetPlans
                    .Include(p => p.Categories)
                    .ToListAsync();
                return Results.Ok(plans.Select(p => p.ToDto()));
            });

            group.MapPost("", async (CreateBudgetPlanDto dto, ApplicationDbContext db) =>
            {
                var plan = new BudgetPlan
                {
                    Id = Guid.NewGuid(),
                    UserId = Guid.Empty, // TODO: replace with current user id when auth added
                    Name = dto.Name,
                    Type = dto.Type,
                    Currency = dto.Currency
                };
                db.BudgetPlans.Add(plan);
                await db.SaveChangesAsync();
                return Results.Created($"/api/budgets/{plan.Id}", plan.ToDto());
            });

            group.MapPost("/{planId:guid}/categories", async (Guid planId, CreateBudgetCategoryDto dto, ApplicationDbContext db) =>
            {
                var plan = await db.BudgetPlans.Include(p => p.Categories).FirstOrDefaultAsync(p => p.Id == planId);
                if (plan == null) return Results.NotFound();

                var cat = new BudgetCategory
                {
                    Id = Guid.NewGuid(),
                    BudgetPlanId = plan.Id,
                    Name = dto.Name,
                    ColorHex = dto.ColorHex,
                    BudgetedAmount = dto.BudgetedAmount
                };
                db.BudgetCategories.Add(cat);
                await db.SaveChangesAsync();
                return Results.Created($"/api/budgets/{plan.Id}/categories/{cat.Id}", cat.ToDto());
            });

            group.MapGet("/{planId:guid}/categories", async (Guid planId, ApplicationDbContext db) =>
            {
                var categories = await db.BudgetCategories
                    .Where(c => c.BudgetPlanId == planId)
                    .ToListAsync();
                return Results.Ok(categories.Select(c => c.ToDto()));
            });

            group.MapPost("/categories/{categoryId:guid}/expenses", async (Guid categoryId, CreateExpenseDto dto, ApplicationDbContext db) =>
            {
                var category = await db.BudgetCategories.FirstOrDefaultAsync(c => c.Id == categoryId);
                if (category == null) return Results.NotFound();

                var expense = new Expense
                {
                    Id = Guid.NewGuid(),
                    BudgetCategoryId = category.Id,
                    Amount = dto.Amount,
                    Description = dto.Description,
                    Date = dto.Date
                };
                db.Expenses.Add(expense);
                await db.SaveChangesAsync();
                return Results.Created($"/api/budgets/categories/{categoryId}/expenses/{expense.Id}", expense.ToDto());
            });

            group.MapGet("/categories/{categoryId:guid}/expenses", async (Guid categoryId, ApplicationDbContext db) =>
            {
                var expenses = await db.Expenses
                    .Where(e => e.BudgetCategoryId == categoryId)
                    .OrderByDescending(e => e.Date)
                    .ToListAsync();
                return Results.Ok(expenses.Select(e => e.ToDto()));
            });

            return app;
        }
    }
}


