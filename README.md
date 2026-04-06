# Smart Inventory System

A modern full-stack inventory management application built with Express.js, Next.js, PostgreSQL, and TypeScript.

## Features

- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Inventory Management**: Create, read, update, and delete items with category organization
- **Category Management**: Organize items into categories with full CRUD operations
- **Admin Dashboard**: Comprehensive user management panel for administrators
- **Real-time Statistics**: Dashboard with inventory insights and low-stock alerts
- **Role-Based Access**: Separate permissions for admin and regular users
- **Responsive Design**: Beautiful UI built with shadcn/ui components and Tailwind CSS
- **Professional Components**: Modern UI components with Radix UI primitives

## Tech Stack

### Backend
- **Express.js** 5.2.1 - Node.js web framework
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Secure authentication
- **bcrypt** - Password hashing
- **Node.js & npm** - Runtime and package management

### Frontend
- **Next.js** 16.2.2 - React framework with Turbopack
- **React** 19 - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** 4.2.2 - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **Axios** - HTTP client with interceptors
- **Radix UI** - Headless UI primitives
- **lucide-react** - Icon library

## Project Structure

```
inventory/
├── backend/
│   ├── app.js                 # Main server file
│   ├── package.json
│   ├── config/
│   │   └── db.js             # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── itemController.js  # Item CRUD operations
│   │   ├── categoryController.js # Category CRUD operations
│   │   └── userController.js  # User management
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── adminMiddleware.js # Admin authorization
│   └── routes/
│       ├── authRoutes.js
│       ├── itemRoutes.js
│       ├── categoryRoutes.js
│       └── userRoutes.js
│
└── frontend/
    ├── app/
    │   ├── layout.tsx         # Root layout
    │   ├── page.tsx           # Dashboard
    │   ├── login/
    │   │   └── page.tsx       # Login page
    │   ├── items/
    │   │   ├── page.tsx       # Items list
    │   │   ├── create/
    │   │   │   └── page.tsx   # Create item
    │   │   └── [id]/
    │   │       └── edit/
    │   │           └── page.tsx # Edit item
    │   ├── categories/
    │   │   ├── page.tsx       # Categories list
    │   │   ├── create/
    │   │   │   └── page.tsx   # Create category
    │   │   └── [id]/
    │   │       └── edit/
    │   │           └── page.tsx # Edit category
    │   └── admin/
    │       └── users/
    │           └── page.tsx   # Admin users panel
    ├── components/
    │   ├── Navbar.tsx         # Navigation component
    │   └── ItemTable.tsx      # Reusable table
    ├── services/
    │   └── api.ts            # Axios client with interceptors
    ├── lib/
    │   └── utils.ts          # Utility functions
    ├── tailwind.config.js    # Tailwind configuration
    ├── next.config.ts        # Next.js configuration
    └── package.json
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 13+

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=inventory
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Items
- `GET /api/items` - Get all items (protected)
- `POST /api/items` - Create new item (protected)
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)

### Categories
- `GET /api/categories` - Get all categories (protected)
- `POST /api/categories` - Create new category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Users
- `GET /api/users/me` - Get current user info (protected)
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. When users log in, they receive a token that must be included in the Authorization header for protected routes:

```
Authorization: Bearer <token>
```

Tokens are automatically managed by the Axios interceptor in the frontend and stored in localStorage.

## User Roles

- **User**: Can view items and categories, cannot perform admin operations
- **Admin**: Can manage items, categories, and users, has full system access

## Running the Application

1. Ensure PostgreSQL is running
2. Start the backend: `npm run dev` (in backend directory)
3. Start the frontend: `npm run dev` (in frontend directory)
4. Open `http://localhost:3000` in your browser
5. Log in with your credentials or register a new account

## Default Test Account

Create a test account or register a new one through the login page.

## Deployment

Both the backend and frontend can be deployed to various hosting platforms:

- **Backend**: Heroku, AWS, DigitalOcean, Railway
- **Frontend**: Vercel, Netlify, AWS Amplify

## Development Guide

### Adding a New Feature

1. Create backend endpoints in the appropriate controller
2. Add routes in the routes directory
3. Create frontend pages/components
4. Add API calls in `services/api.ts`
5. Update navigation if needed

### Database Migrations

If you need to add new tables or columns:
1. Modify `config/db.js`
2. Run the migration script
3. Update controllers accordingly

## Error Handling

- **401 Unauthorized**: Token is missing or invalid - user is redirected to login
- **403 Forbidden**: User lacks necessary permissions for the operation
- **404 Not Found**: Requested resource does not exist
- **500 Internal Server Error**: Server-side error occurred

## Performance Optimizations

- JWT tokens for stateless authentication
- PostgreSQL indexing on frequently queried columns
- React component lazy loading where applicable
- CSS optimization with Tailwind's purge feature
- API response caching in the frontend

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

MIT License - Feel free to use this project for personal and commercial purposes.

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using modern web technologies
