using System;

namespace CashCraft.Api.Domain.Entities
{
    public class Expense
    {
        public Guid Id { get; set; }
        public Guid BudgetCategoryId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public BudgetCategory? BudgetCategory { get; set; }
    }
}


