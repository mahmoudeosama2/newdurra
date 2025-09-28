# Hamed Awadh Group - Backend & Admin Dashboard

A complete backend system with admin dashboard for managing images and categories for the Hamed Awadh Group website.

## 🏗️ Project Structure

```
├── backend/                 # Node.js/Express API server
│   ├── server.js           # Main server file
│   ├── scripts/            # Database initialization scripts
│   ├── database/           # SQLite database files
│   ├── uploads/            # Uploaded images/videos
│   └── package.json        # Backend dependencies
├── admin-dashboard/        # React admin interface
│   ├── src/                # React source files
│   ├── dist/               # Built admin dashboard
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
DB_PATH=./database/app.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
PORT=3001
FRONTEND_URL=https://yourdomain.com
```

Initialize database and start server:
```bash
npm run init-db
npm start
```

### 2. Admin Dashboard Setup

```bash
cd admin-dashboard
npm install
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

Build for production:
```bash
npm run build
```

## 📡 API Endpoints

### Authentication
- `POST /api/login` - Admin login

### Categories
- `GET /api/categories` - Get all categories with images
- `POST /api/categories` - Create new category (auth required)
- `PUT /api/categories/:id` - Update category (auth required)
- `DELETE /api/categories/:id` - Delete category (auth required)

### Images
- `POST /api/images` - Upload image (auth required)
- `DELETE /api/images/:id` - Delete image (auth required)

### Utility
- `GET /api/health` - Health check
- `GET /uploads/:filename` - Serve uploaded files

## 🗄️ Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Images Table
```sql
CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  title TEXT,
  title_ar TEXT,
  video_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 cPanel Deployment

### 1. Upload Files
1. Upload `backend/` folder to your cPanel file manager
2. Upload `admin-dashboard/dist/` contents to a subfolder (e.g., `/admin`)

### 2. Setup Node.js App (if supported)
1. Go to cPanel → Node.js Apps
2. Create new app pointing to your backend folder
3. Set startup file to `server.js`
4. Install dependencies: `npm install`

### 3. Alternative PHP Setup (if Node.js not available)
If your cPanel doesn't support Node.js, you can use the PHP version:

```php
<?php
// Simple PHP proxy for the API
// Place this in your /api folder
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Your PHP API implementation here
// (This would require a full PHP rewrite of the Node.js backend)
?>
```

### 4. Database Setup
1. Create MySQL database in cPanel
2. Update `.env` file with MySQL credentials
3. Run initialization script

### 5. Configure URLs
Update your frontend to use the production API URL:
```javascript
// In your React frontend
const API_BASE_URL = 'https://yourdomain.com/api';
```

## 🔧 Frontend Integration

Update your existing React frontend to fetch data from the API:

```javascript
// Replace static imports with API calls
import { useState, useEffect } from 'react';
import axios from 'axios';

const Properties = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://yourdomain.com/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use categories data instead of static imports
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          {category.images.map(image => (
            <img 
              key={image.id}
              src={`https://yourdomain.com/uploads/${image.filename}`}
              alt={image.title}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- File type validation
- SQL injection protection
- Helmet security headers

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd admin-dashboard
npm run dev  # Vite dev server with proxy
```

## 📝 Default Credentials

- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change the default password immediately after first login!

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update `FRONTEND_URL` in backend `.env`
   - Check API URL in frontend `.env`

2. **File Upload Fails**
   - Check file permissions on uploads folder
   - Verify file size limits
   - Ensure allowed file types are correct

3. **Database Connection Issues**
   - Check database file permissions
   - Verify database path in `.env`
   - Run `npm run init-db` to recreate database

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT secret in `.env`
   - Verify token expiration settings

## 📞 Support

For issues or questions, please check:
1. Server logs for error details
2. Browser console for frontend errors
3. Database file permissions
4. Environment variable configuration

## 🔄 Updates

To update the system:
1. Backup your database and uploads folder
2. Update the code files
3. Run `npm install` for any new dependencies
4. Restart the server

---

**Note:** This system is designed to work with your existing React frontend while providing a robust backend for image and category management.# durra
# durra
# elduraa-new
# elduraa-new
