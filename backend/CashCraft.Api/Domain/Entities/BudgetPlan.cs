using System;
using System.Collections.Generic;

namespace CashCraft.Api.Domain.Entities
{
    public class BudgetPlan
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "monthly"; // monthly|yearly
        public string Currency { get; set; } = "EGP";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public ICollection<BudgetCategory> Categories { get; set; } = new List<BudgetCategory>();
    }
}


