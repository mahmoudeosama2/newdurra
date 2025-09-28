# cPanel Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Prepare Files for Upload

1. **Backend Files:**
   - Zip the entire `backend/` folder
   - Make sure `.env` file is configured with production settings

2. **Admin Dashboard:**
   - Run `npm run build` in the `admin-dashboard/` folder
   - This creates a `dist/` folder with static files

### 2. Upload to cPanel

1. **Login to cPanel File Manager**
2. **Upload Backend:**
   - Create a folder called `api` in your public_html
   - Upload and extract the backend files to `/public_html/api/`
3. **Upload Admin Dashboard:**
   - Create a folder called `admin` in your public_html
   - Upload the contents of `admin-dashboard/dist/` to `/public_html/admin/`

### 3. Configure Node.js (if supported)

1. **Go to Node.js Apps in cPanel**
2. **Create New App:**
   - App Root: `/public_html/api`
   - App URL: `yourdomain.com/api`
   - Startup File: `server.js`
   - Node.js Version: 16+ or latest available

3. **Install Dependencies:**
   ```bash
   cd /public_html/api
   npm install
   ```

4. **Set Environment Variables:**
   - Add your production environment variables in the Node.js app settings

### 4. Alternative: PHP Version (if Node.js not supported)

If your cPanel doesn't support Node.js, here's a simplified PHP version:

**Create `/public_html/api/index.php`:**

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$db_host = 'localhost';
$db_name = 'your_database_name';
$db_user = 'your_database_user';
$db_pass = 'your_database_password';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Get request path
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$path = str_replace('/api', '', $path);

// Route handling
switch ($path) {
    case '/categories':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            getCategoriesWithImages($pdo);
        }
        break;
    
    case '/login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            handleLogin($pdo);
        }
        break;
    
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

function getCategoriesWithImages($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT c.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', i.id,
                           'filename', i.filename,
                           'title', i.title,
                           'video_url', i.video_url
                       )
                   ) as images
            FROM categories c
            LEFT JOIN images i ON c.id = i.category_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        ");
        
        $categories = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['images'] = $row['images'] ? 
                array_map('json_decode', explode(',', $row['images'])) : [];
            $categories[] = $row;
        }
        
        echo json_encode($categories);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
}

function handleLogin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['username']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password required']);
        return;
    }
    
    
    // Simple authentication (replace with your logic)
    if ($input['username'] === 'admin' && $input['password'] === 'admin123') {
        $token = base64_encode(json_encode([
            'username' => $input['username'],
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ]));
        
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => ['username' => $input['username']]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
}
?>
```

### 5. Database Setup

**Create MySQL Database:**

```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  title_ar VARCHAR(255),
  video_url TEXT,
  file_size INT,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
```

### 6. Configure Frontend URLs

Update your React frontend to use the production API:

**In your main React app:**

```javascript
// Replace this in your Properties component or wherever you fetch data
const API_BASE_URL = 'https://yourdomain.com/api';

// Example usage:
useEffect(() => {
  fetch(`${API_BASE_URL}/categories`)
    .then(response => response.json())
    .then(data => {
      // Use the data to replace your static imports
      setCategories(data);
    });
}, []);
```

### 7. File Permissions

Set proper permissions via cPanel File Manager:
- `/api/` folder: 755
- `/api/uploads/` folder: 755 (create this folder)
- `/admin/` folder: 755

### 8. Test the Setup

1. **Test API:** Visit `https://yourdomain.com/api/categories`
2. **Test Admin:** Visit `https://yourdomain.com/admin`
3. **Login:** Use admin/admin123 (change this immediately!)

### 9. Security Checklist

- [ ] Change default admin password
- [ ] Update JWT secret in production
- [ ] Set proper CORS origins
- [ ] Enable HTTPS
- [ ] Set file upload limits
- [ ] Regular database backups

### 10. Maintenance

**Regular Tasks:**
- Backup database weekly
- Monitor upload folder size
- Check server logs for errors
- Update dependencies monthly

**Backup Command (if you have SSH access):**
```bash
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

---

This deployment guide should get your backend and admin dashboard running on cPanel. The system will allow you to manage images and categories dynamically while keeping your existing frontend design intact.