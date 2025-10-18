# Collabstr Clone - Creator & Brand Collaboration Platform

A full-stack web application that replicates the core functionality of Collabstr, connecting content creators with brands for collaboration opportunities.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://your-app.vercel.app)
- **Backend API**: [API Endpoints](https://your-app.vercel.app/api)

## ✨ Features

### For Creators
- Profile creation with social media stats
- Browse collaboration opportunities
- Apply to brand partnerships
- Set custom rates for different content types
- Dashboard with earnings and analytics

### For Brands
- Post collaboration opportunities
- Browse verified creators
- Filter creators by category, location, and follower count
- Manage collaboration applications
- Campaign creation wizard

### General Features
- User authentication (JWT-based)
- Responsive design with Tailwind CSS
- Real-time search and filtering
- Modern React with TypeScript
- RESTful API with Express.js
- MongoDB Atlas integration

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB Atlas with Mongoose
- JWT authentication
- bcryptjs for password hashing
- Cloudinary for image uploads

## 📦 Deployment

### Vercel Deployment (Recommended)

1. **Fork this repository**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Set Environment Variables in Vercel:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabstr
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```

4. **Deploy:**
   - Vercel will automatically build and deploy both frontend and backend
   - Your app will be available at `https://your-app.vercel.app`

### Manual Deployment

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/collabstr-clone.git
cd collabstr-clone
```

2. **Install dependencies:**
```bash
npm run install-deps
```

3. **Set up environment variables:**
Create `server/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_URL=your_cloudinary_url
```

4. **Build and deploy:**
```bash
npm run build
```

## 🏃‍♂️ Local Development

1. **Install dependencies:**
```bash
npm run install-deps
```

2. **Seed the database:**
```bash
cd server && npm run seed
```

3. **Start development servers:**
```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000).

## 📁 Project Structure

```
collabstr-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── seedData.js         # Database seeding
│   └── index.js            # Server entry point
├── vercel.json             # Vercel configuration
└── package.json            # Root package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/creators` - Get all creators with filters
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Collaborations
- `GET /api/collaborations` - Get all collaborations
- `POST /api/collaborations` - Create collaboration
- `POST /api/collaborations/:id/apply` - Apply to collaboration

## 🧪 Sample Data

The app includes sample data for testing:

**Sample Creator Login:**
- Email: `sarah.fashion@example.com`
- Password: `password123`

**Sample Brand Login:**
- Email: `partnerships@fashionnova.com`
- Password: `password123`

## 🌟 Key Features Implemented

- ✅ Complete authentication system
- ✅ User dashboards with analytics
- ✅ Multi-step campaign creation
- ✅ Advanced search and filtering
- ✅ Responsive design for all devices
- ✅ Professional UI matching Collabstr
- ✅ MongoDB Atlas integration
- ✅ Vercel-ready deployment
- ✅ Sample data for immediate testing

## 🚀 Environment Variables

### Required for Production:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabstr
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using React, Node.js, and MongoDB**# collabstr-clone
