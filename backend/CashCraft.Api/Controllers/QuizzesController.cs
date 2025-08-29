using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CashCraft.Api.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using CashCraft.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public QuizzesController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(qq => qq.Options)
                .OrderByDescending(q => q.PublishedAt ?? q.CreatedAt)
                .ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var item = await _db.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(qq => qq.Options)
                .FirstOrDefaultAsync(q => q.Id == id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        public class CreateQuizRequest
        {
            public string Slug { get; set; } = string.Empty;
            public string TitleEn { get; set; } = string.Empty;
            public string TitleAr { get; set; } = string.Empty;
            public List<CreateQuizQuestion> Questions { get; set; } = new();
        }

        public class CreateQuizQuestion
        {
            public string TextEn { get; set; } = string.Empty;
            public string TextAr { get; set; } = string.Empty;
            public List<CreateQuizOption> Options { get; set; } = new();
        }

        public class CreateQuizOption
        {
            public string TextEn { get; set; } = string.Empty;
            public string TextAr { get; set; } = string.Empty;
            public bool IsCorrect { get; set; }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Create([FromBody] CreateQuizRequest req)
        {
            var quiz = new Quiz
            {
                Id = Guid.NewGuid(),
                Slug = req.Slug,
                TitleEn = req.TitleEn,
                TitleAr = req.TitleAr,
                PublishedAt = DateTime.UtcNow,
                Questions = req.Questions.Select(q => new QuizQuestion
                {
                    Id = Guid.NewGuid(),
                    TextEn = q.TextEn,
                    TextAr = q.TextAr,
                    Options = q.Options.Select(o => new QuizOption
                    {
                        Id = Guid.NewGuid(),
                        TextEn = o.TextEn,
                        TextAr = o.TextAr,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            _db.Quizzes.Add(quiz);
            await _db.SaveChangesAsync();
            return Created($"api/quizzes/{quiz.Id}", quiz);
        }
    }
}


