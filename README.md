# CashCraft 💰

> Made with ❤️ by **Team 14**

## 👥 Team Members

<div align="center">

<a href="https://github.com/MostafaMohamed-stu">
  <img src="https://github.com/MostafaMohamed-stu.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="Mostafa Mohamed"/>
  <br />
  <sub><b>Mostafa Mohamed</b></sub>
</a>

<a href="https://github.com/kyouka0">
  <img src="https://github.com/kyouka0.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="kyouka0"/>
  <br />
  <sub><b>kyouka0</b></sub>
</a>

<a href="https://github.com/HabibaAmrhu">
  <img src="https://github.com/HabibaAmrhu.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="Habiba Amr"/>
  <br />
  <sub><b>Habiba Amr</b></sub>
</a>

<a href="https://github.com/ziadelfarhy">
  <img src="https://github.com/ziadelfarhy.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="Ziad El Farhy"/>
  <br />
  <sub><b>Ziad El Farhy</b></sub>
</a>

<a href="https://github.com/DEV-12AM">
  <img src="https://github.com/DEV-12AM.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="DEV-12AM"/>
  <br />
  <sub><b>DEV-12AM</b></sub>
</a>

</div>

---

A comprehensive personal finance management web application that helps users track expenses, create budgets, and learn financial literacy.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

CashCraft is a full-stack financial management application designed to help users:
- **Track Expenses**: Record and categorize daily spending
- **Create Budgets**: Set up monthly or yearly budget plans with custom categories
- **Monitor Progress**: Visualize spending against budget limits with progress indicators
- **Learn Finance**: Access educational articles, videos, and quizzes
- **Make Better Decisions**: Get insights and tips to improve financial health

## ✨ Features

### Budget Management
- Create budget plans (Monthly/Yearly)
- Add custom budget categories with colors and icons
- Set spending limits per category
- Track expenses against budgets
- Visual progress indicators
- Over-budget alerts

### Expense Tracking
- Record daily expenses
- Categorize spending automatically
- View expense history
- Filter by category and date
- Export expense reports

### Financial Education
- Read educational articles
- Watch instructional videos
- Take financial quizzes
- Get personalized saving tips
- Track learning progress

### User Management
- User registration and authentication
- JWT-based secure authentication
- Premium user features
- Personal dashboard
- Profile management

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: ASP.NET Core (.NET 9.0)
- **Language**: C#
- **ORM**: Entity Framework Core
- **Database**: SQL Server
- **Authentication**: JWT (JSON Web Tokens)

### Development Tools
- **Package Manager**: npm/pnpm
- **API Testing**: HTTP files
- **Version Control**: Git

## 📁 Project Structure

```
cashcraft-nextjs/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Dashboard pages
│   │   ├── budget/             # Budget management
│   │   └── page.tsx            # Main dashboard
│   ├── articles/                # Articles page
│   ├── videos/                  # Videos page
│   ├── quiz/                    # Quiz pages
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   └── layout.tsx               # Root layout
├── backend/
│   └── CashCraft.Api/           # .NET API project
│       ├── Controllers/         # API controllers
│       ├── Domain/              # Domain entities
│       ├── Infrastructure/      # DbContext, migrations
│       ├── Application/         # DTOs, mappings
│       └── Program.cs           # API configuration
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── Navbar.tsx               # Navigation bar
│   ├── AuthScreen.tsx           # Auth components
│   └── AddCategoriesModal.tsx  # Category modal
├── lib/                          # Utility functions
│   ├── api.ts                   # API client
│   ├── utils.ts                 # Helper functions
│   └── translations.ts          # i18n translations
├── contexts/                     # React contexts
│   └── AppContext.tsx           # App state management
└── public/                       # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- .NET 9.0 SDK
- SQL Server (or SQL Server Express)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cashcraft-nextjs
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Setup backend**
   ```bash
   cd backend/CashCraft.Api
   dotnet restore
   ```

4. **Configure database**
   - Update connection string in `appsettings.json` or `appsettings.Development.json`
   - Run migrations:
   ```bash
   dotnet ef database update
   ```

5. **Configure API URL**
   - Update `API_BASE` in `lib/api.ts` if needed (default: `http://localhost:5005/api`)

### Running the Application

1. **Start the backend API**
   ```bash
   cd backend/CashCraft.Api
   dotnet run
   ```
   API will run on `http://localhost:5005`

2. **Start the frontend**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Register a new account or login

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/users/me` - Get current user

### Budget Plans
- `GET /api/budgets/plans` - Get all plans for user
- `POST /api/budgets/plans` - Create new plan
- `GET /api/budgets/plans/{id}` - Get plan by ID

### Categories
- `GET /api/budgets/plans/{planId}/categories` - Get categories for plan
- `POST /api/budgets/plans/{planId}/categories` - Add category to plan

### Expenses
- `GET /api/budgets/categories/{categoryId}/expenses` - Get expenses for category
- `POST /api/budgets/categories/{categoryId}/expenses` - Add expense

## 📖 Usage

### Creating a Budget Plan

1. Click **"Create Budget Plan"** button on dashboard
2. Fill in basic information:
   - Plan Name (e.g., "Monthly Budget 2025")
   - Currency (EGP, USD, EUR)
   - Plan Type (Normal or AI)
   - Duration (Monthly or Yearly)
3. Click **"Create Plan"**
4. Use **"Add Categories"** button to add budget categories
5. Set budget amounts for each category

### Adding Expenses

1. Click **"Add Expense"** button
2. Select category
3. Enter amount and description
4. Select date
5. Save expense

### Managing Categories

1. Click **"Add Categories"** button
2. Use quick-add buttons or create custom categories
3. Set budget amount for each category
4. Categories appear on dashboard with progress indicators

## 🎨 Color Scheme

- **Primary Color**: `#6099a5` (Teal)
- **Accent Colors**: Various category colors
- **Background**: Light/Dark mode support

## 📸 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

**Team 14**
- [Mostafa Mohamed](https://github.com/MostafaMohamed-stu)
- [kyouka0](https://github.com/kyouka0)
- [Habiba Amr](https://github.com/HabibaAmrhu)
- [Ziad El Farhy](https://github.com/ziadelfarhy)
- [DEV-12AM](https://github.com/DEV-12AM)

## 🙏 Acknowledgments

- shadcn/ui for the component library
- Next.js team for the amazing framework
- All contributors and users

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ by **Team 14** for better financial management
# CashCraft 💰

> Made with ❤️ by **Team 14**

## 👥 Team Members

<div align="center">

<a href="https://github.com/MostafaMohamed-stu">
  <img src="https://github.com/MostafaMohamed-stu.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="Mostafa Mohamed"/>
  <br />
  <sub><b>Mostafa Mohamed</b></sub>
</a>

<a href="https://github.com/kyouka0">
  <img src="https://github.com/kyouka0.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="kyouka0"/>
  <br />
  <sub><b>kyouka0</b></sub>
</a>

<a href="https://github.com/HabibaAmrhu">
  <img src="https://github.com/HabibaAmrhu.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="Habiba Amr"/>
  <br />
  <sub><b>Habiba Amr</b></sub>
</a>

<a href="https://github.com/ziadelfarhy">
  <img src="https://github.com/ziadelfarhy.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="Ziad El Farhy"/>
  <br />
  <sub><b>Ziad El Farhy</b></sub>
</a>

<a href="https://github.com/DEV-12AM">
  <img src="https://github.com/DEV-12AM.png?size=100" width="100" height="100" style="border-radius: 50%; margin: 10px;" alt="DEV-12AM"/>
  <br />
  <sub><b>DEV-12AM</b></sub>
</a>

</div>

---

A comprehensive personal finance management web application that helps users track expenses, create budgets, and learn financial literacy.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

CashCraft is a full-stack financial management application designed to help users:
- **Track Expenses**: Record and categorize daily spending
- **Create Budgets**: Set up monthly or yearly budget plans with custom categories
- **Monitor Progress**: Visualize spending against budget limits with progress indicators
- **Learn Finance**: Access educational articles, videos, and quizzes
- **Make Better Decisions**: Get insights and tips to improve financial health

## ✨ Features

### Budget Management
- Create budget plans (Monthly/Yearly)
- Add custom budget categories with colors and icons
- Set spending limits per category
- Track expenses against budgets
- Visual progress indicators
- Over-budget alerts

### Expense Tracking
- Record daily expenses
- Categorize spending automatically
- View expense history
- Filter by category and date
- Export expense reports

### Financial Education
- Read educational articles
- Watch instructional videos
- Take financial quizzes
- Get personalized saving tips
- Track learning progress

### User Management
- User registration and authentication
- JWT-based secure authentication
- Premium user features
- Personal dashboard
- Profile management

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: ASP.NET Core (.NET 9.0)
- **Language**: C#
- **ORM**: Entity Framework Core
- **Database**: SQL Server
- **Authentication**: JWT (JSON Web Tokens)

### Development Tools
- **Package Manager**: npm/pnpm
- **API Testing**: HTTP files
- **Version Control**: Git

## 📁 Project Structure

```
cashcraft-nextjs/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Dashboard pages
│   │   ├── budget/             # Budget management
│   │   └── page.tsx            # Main dashboard
│   ├── articles/                # Articles page
│   ├── videos/                  # Videos page
│   ├── quiz/                    # Quiz pages
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   └── layout.tsx               # Root layout
├── backend/
│   └── CashCraft.Api/           # .NET API project
│       ├── Controllers/         # API controllers
│       ├── Domain/              # Domain entities
│       ├── Infrastructure/      # DbContext, migrations
│       ├── Application/         # DTOs, mappings
│       └── Program.cs           # API configuration
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── Navbar.tsx               # Navigation bar
│   ├── AuthScreen.tsx           # Auth components
│   └── AddCategoriesModal.tsx  # Category modal
├── lib/                          # Utility functions
│   ├── api.ts                   # API client
│   ├── utils.ts                 # Helper functions
│   └── translations.ts          # i18n translations
├── contexts/                     # React contexts
│   └── AppContext.tsx           # App state management
└── public/                       # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- .NET 9.0 SDK
- SQL Server (or SQL Server Express)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cashcraft-nextjs
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Setup backend**
   ```bash
   cd backend/CashCraft.Api
   dotnet restore
   ```

4. **Configure database**
   - Update connection string in `appsettings.json` or `appsettings.Development.json`
   - Run migrations:
   ```bash
   dotnet ef database update
   ```

5. **Configure API URL**
   - Update `API_BASE` in `lib/api.ts` if needed (default: `http://localhost:5005/api`)

### Running the Application

1. **Start the backend API**
   ```bash
   cd backend/CashCraft.Api
   dotnet run
   ```
   API will run on `http://localhost:5005`

2. **Start the frontend**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Register a new account or login

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/users/me` - Get current user

### Budget Plans
- `GET /api/budgets/plans` - Get all plans for user
- `POST /api/budgets/plans` - Create new plan
- `GET /api/budgets/plans/{id}` - Get plan by ID

### Categories
- `GET /api/budgets/plans/{planId}/categories` - Get categories for plan
- `POST /api/budgets/plans/{planId}/categories` - Add category to plan

### Expenses
- `GET /api/budgets/categories/{categoryId}/expenses` - Get expenses for category
- `POST /api/budgets/categories/{categoryId}/expenses` - Add expense

## 📖 Usage

### Creating a Budget Plan

1. Click **"Create Budget Plan"** button on dashboard
2. Fill in basic information:
   - Plan Name (e.g., "Monthly Budget 2025")
   - Currency (EGP, USD, EUR)
   - Plan Type (Normal or AI)
   - Duration (Monthly or Yearly)
3. Click **"Create Plan"**
4. Use **"Add Categories"** button to add budget categories
5. Set budget amounts for each category

### Adding Expenses

1. Click **"Add Expense"** button
2. Select category
3. Enter amount and description
4. Select date
5. Save expense

### Managing Categories

1. Click **"Add Categories"** button
2. Use quick-add buttons or create custom categories
3. Set budget amount for each category
4. Categories appear on dashboard with progress indicators

## 🎨 Color Scheme

- **Primary Color**: `#6099a5` (Teal)
- **Accent Colors**: Various category colors
- **Background**: Light/Dark mode support

## 📸 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

**Team 14**
- [Mostafa Mohamed](https://github.com/MostafaMohamed-stu)
- [kyouka0](https://github.com/kyouka0)
- [Habiba Amr](https://github.com/HabibaAmrhu)
- [Ziad El Farhy](https://github.com/ziadelfarhy)
- [DEV-12AM](https://github.com/DEV-12AM)

## 🙏 Acknowledgments

- shadcn/ui for the component library
- Next.js team for the amazing framework
- All contributors and users

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ by **Team 14** for better financial management
