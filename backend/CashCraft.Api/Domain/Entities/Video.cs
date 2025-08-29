namespace CashCraft.Api.Domain.Entities
{
    public class Video : Content
    {
        public string Url { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public int? DurationSec { get; set; }
    }
}


