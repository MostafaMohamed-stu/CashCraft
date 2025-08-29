using CashCraft.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Api.Infrastructure
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<BudgetPlan> BudgetPlans => Set<BudgetPlan>();
        public DbSet<BudgetCategory> BudgetCategories => Set<BudgetCategory>();
        public DbSet<Expense> Expenses => Set<Expense>();
        public DbSet<Article> Articles => Set<Article>();
        public DbSet<Video> Videos => Set<Video>();
        public DbSet<Quiz> Quizzes => Set<Quiz>();
        public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
        public DbSet<QuizOption> QuizOptions => Set<QuizOption>();
        public DbSet<QuizAttempt> QuizAttempts => Set<QuizAttempt>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<BudgetCategory>()
                .Property(b => b.BudgetedAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Expense>()
                .Property(e => e.Amount)
                .HasColumnType("decimal(18,2)");
        }
    }
}


