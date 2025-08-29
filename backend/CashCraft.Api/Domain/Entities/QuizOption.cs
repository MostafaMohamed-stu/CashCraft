using System;

namespace CashCraft.Api.Domain.Entities
{
    public class QuizOption
    {
        public Guid Id { get; set; }
        public Guid QuestionId { get; set; }
        public int Order { get; set; }
        public string TextEn { get; set; } = string.Empty;
        public string TextAr { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }

        public QuizQuestion? Question { get; set; }
    }
}


