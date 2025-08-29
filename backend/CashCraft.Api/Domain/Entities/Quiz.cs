using System;
using System.Collections.Generic;

namespace CashCraft.Api.Domain.Entities
{
    public class Quiz : Content
    {
        public bool IsPublished { get; set; }
        public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
    }
}


