using System;
using System.Collections.Generic;

namespace CashCraft.Api.Application.DTOs
{
    // ===== PLAN DTOs =====
    
    public class BudgetPlanDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<BudgetCategoryDto> Categories { get; set; } = new();
    }

    public class CreateBudgetPlanDto
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "monthly";
        public string Currency { get; set; } = "EGP";
        public DateTime? CreatedAt { get; set; }
    }

    public class CreateBudgetPlanResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // ===== CATEGORY DTOs =====
    
    public class BudgetCategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ColorHex { get; set; } = string.Empty;
        public decimal BudgetedAmount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateBudgetCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string ColorHex { get; set; } = "#3b82f6";
        public decimal BudgetedAmount { get; set; }
    }

    public class CreateBudgetCategoryResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ColorHex { get; set; } = string.Empty;
        public decimal BudgetedAmount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // ===== EXPENSE DTOs =====
    
    public class ExpenseDto
    {
        public Guid Id { get; set; }
        public Guid BudgetCategoryId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateExpenseDto
    {
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
    }

    public class CreateExpenseResponseDto
    {
        public Guid Id { get; set; }
        public Guid BudgetCategoryId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}



