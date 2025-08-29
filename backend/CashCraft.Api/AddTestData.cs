using Microsoft.EntityFrameworkCore;
using CashCraft.Api.Domain.Entities;
using CashCraft.Api.Infrastructure;

namespace CashCraft.Api
{
    public class AddTestData
    {
        public static async Task AddTestBudgetData(ApplicationDbContext context)
        {
            try
            {
                // Find the test user
                var testUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "testbudget@test.com");
                
                if (testUser == null)
                {
                    Console.WriteLine("Test user not found. Please register the account first.");
                    return;
                }

                Console.WriteLine($"Found test user: {testUser.DisplayName} ({testUser.Email})");

                // Check if user already has budget plans
                var existingPlans = await context.BudgetPlans.Where(p => p.UserId == testUser.Id).ToListAsync();
                if (existingPlans.Any())
                {
                    Console.WriteLine($"User already has {existingPlans.Count} budget plan(s). Skipping...");
                    return;
                }

                // Create a test budget plan
                var budgetPlan = new BudgetPlan
                {
                    Id = Guid.NewGuid(),
                    Name = "Monthly Budget Plan",
                    Type = "monthly",
                    Currency = "EGP",
                    CreatedAt = DateTime.UtcNow,
                    UserId = testUser.Id
                };

                context.BudgetPlans.Add(budgetPlan);
                await context.SaveChangesAsync();

                Console.WriteLine($"Created budget plan: {budgetPlan.Name}");

                // Create budget categories
                var categories = new List<BudgetCategory>
                {
                    new BudgetCategory
                    {
                        Id = Guid.NewGuid(),
                        Name = "Food",
                        BudgetedAmount = 1500,
                        ColorHex = "#ef4444",
                        BudgetPlanId = budgetPlan.Id
                    },
                    new BudgetCategory
                    {
                        Id = Guid.NewGuid(),
                        Name = "Transport",
                        BudgetedAmount = 800,
                        ColorHex = "#3b82f6",
                        BudgetPlanId = budgetPlan.Id
                    },
                    new BudgetCategory
                    {
                        Id = Guid.NewGuid(),
                        Name = "Housing",
                        BudgetedAmount = 2000,
                        ColorHex = "#10b981",
                        BudgetPlanId = budgetPlan.Id
                    },
                    new BudgetCategory
                    {
                        Id = Guid.NewGuid(),
                        Name = "Entertainment",
                        BudgetedAmount = 500,
                        ColorHex = "#f59e0b",
                        BudgetPlanId = budgetPlan.Id
                    },
                    new BudgetCategory
                    {
                        Id = Guid.NewGuid(),
                        Name = "Other",
                        BudgetedAmount = 200,
                        ColorHex = "#6b7280",
                        BudgetPlanId = budgetPlan.Id
                    }
                };

                context.BudgetCategories.AddRange(categories);
                await context.SaveChangesAsync();

                Console.WriteLine($"Created {categories.Count} budget categories");

                // Add some sample expenses
                var expenses = new List<Expense>
                {
                    new Expense
                    {
                        Id = Guid.NewGuid(),
                        Amount = 250,
                        Description = "Grocery shopping",
                        Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-2)),
                        BudgetCategoryId = categories[0].Id // Food
                    },
                    new Expense
                    {
                        Id = Guid.NewGuid(),
                        Amount = 100,
                        Description = "Bus tickets",
                        Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)),
                        BudgetCategoryId = categories[1].Id // Transport
                    },
                    new Expense
                    {
                        Id = Guid.NewGuid(),
                        Amount = 1500,
                        Description = "Rent payment",
                        Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-5)),
                        BudgetCategoryId = categories[2].Id // Housing
                    }
                };

                context.Expenses.AddRange(expenses);
                await context.SaveChangesAsync();

                Console.WriteLine($"Created {expenses.Count} sample expenses");

                await context.SaveChangesAsync();

                Console.WriteLine("✅ Test data added successfully!");
                Console.WriteLine($"Budget Plan: {budgetPlan.Name}");
                Console.WriteLine($"Total Budget: {categories.Sum(c => c.BudgetedAmount)} {budgetPlan.Currency}");
                Console.WriteLine($"Total Spent: {expenses.Sum(e => e.Amount)} {budgetPlan.Currency}");
                Console.WriteLine($"Categories: {categories.Count}");
                Console.WriteLine($"Expenses: {expenses.Count}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding test data: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }
    }
}
