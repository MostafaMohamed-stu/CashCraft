using CashCraft.Api.Application.DTOs;
using CashCraft.Api.Domain.Entities;

namespace CashCraft.Api.Application.Mapping
{
    public static class BudgetMapping
    {
        // ===== PLAN MAPPING =====
        
        public static BudgetPlanDto ToDto(this BudgetPlan plan)
        {
            return new BudgetPlanDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Type = plan.Type,
                Currency = plan.Currency,
                CreatedAt = plan.CreatedAt,
                Categories = plan.Categories.Select(c => c.ToDto()).ToList()
            };
        }

        public static CreateBudgetPlanResponseDto ToCreateResponseDto(this BudgetPlan plan)
        {
            return new CreateBudgetPlanResponseDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Type = plan.Type,
                Currency = plan.Currency,
                CreatedAt = plan.CreatedAt
            };
        }

        // ===== CATEGORY MAPPING =====
        
        public static BudgetCategoryDto ToDto(this BudgetCategory category)
        {
            return new BudgetCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                ColorHex = category.ColorHex,
                BudgetedAmount = category.BudgetedAmount,
                CreatedAt = category.CreatedAt
            };
        }

        public static CreateBudgetCategoryResponseDto ToCreateResponseDto(this BudgetCategory category)
        {
            return new CreateBudgetCategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                ColorHex = category.ColorHex,
                BudgetedAmount = category.BudgetedAmount,
                CreatedAt = category.CreatedAt
            };
        }

        // ===== EXPENSE MAPPING =====
        
        public static ExpenseDto ToDto(this Expense expense)
        {
            return new ExpenseDto
            {
                Id = expense.Id,
                BudgetCategoryId = expense.BudgetCategoryId,
                Amount = expense.Amount,
                Description = expense.Description,
                Date = expense.Date,
                CreatedAt = expense.CreatedAt
            };
        }

        public static CreateExpenseResponseDto ToCreateResponseDto(this Expense expense)
        {
            return new CreateExpenseResponseDto
            {
                Id = expense.Id,
                BudgetCategoryId = expense.BudgetCategoryId,
                Amount = expense.Amount,
                Description = expense.Description,
                Date = expense.Date,
                CreatedAt = expense.CreatedAt
            };
        }
    }
}


