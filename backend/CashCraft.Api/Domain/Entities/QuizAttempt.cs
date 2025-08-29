using System;

namespace CashCraft.Api.Domain.Entities
{
    public class QuizAttempt
    {
        public Guid Id { get; set; }
        public Guid QuizId { get; set; }
        public Guid UserId { get; set; }
        public int Score { get; set; }
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        public Quiz? Quiz { get; set; }
        public User? User { get; set; }
    }
}


