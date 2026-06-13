using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PatientPortal.API.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// -----------------------------------------------------------------
// ১. ডাটাবেজ কনফিগারেশন (PostgreSQL)
// -----------------------------------------------------------------
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// -----------------------------------------------------------------
// ২. জেডব্লিউটি অথেনটিকেশন (JWT Authentication)
// -----------------------------------------------------------------
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt:Key").Value!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration.GetSection("Jwt:Issuer").Value,
            ValidateAudience = true,
            ValidAudience = builder.Configuration.GetSection("Jwt:Audience").Value,
            ValidateLifetime = true
        };
    });

// -----------------------------------------------------------------
// ৩. কর্স পলিসি (CORS - Next.js ফ্রন্টএন্ডের সাথে কানেক্ট করার জন্য)
// -----------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// -----------------------------------------------------------------
// ৪. সিম্পল এপিআই ও সোয়াগার সার্ভিস এড করা (কোনো জটিল কনফিগারেশন ছাড়া)
// -----------------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // একদম ডিফল্ট সোয়াগার, কোনো এরর আসবে না

var app = builder.Build();

// ডেভেলপমেন্ট এনভায়রনমেন্টে সোয়াগার চালু করা
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS পলিসি এক্টিভেট করা (অবশ্যই Authentication এর আগে বসবে)
app.UseCors("NextJsCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();