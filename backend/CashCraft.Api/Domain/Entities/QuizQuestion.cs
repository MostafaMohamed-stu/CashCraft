using System;
using System.Collections.Generic;

namespace CashCraft.Api.Domain.Entities
{
    public class QuizQuestion
    {
        public Guid Id { get; set; }
        public Guid QuizId { get; set; }
        public int Order { get; set; }
        public string TextEn { get; set; } = string.Empty;
        public string TextAr { get; set; } = string.Empty;

        public Quiz? Quiz { get; set; }
        public ICollection<QuizOption> Options { get; set; } = new List<QuizOption>();
    }
}


