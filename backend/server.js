const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use("/api/", limiter);

// CORS configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "*", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOAD_PATH || "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files with category folders
app.use("/uploads", express.static(uploadsDir));
app.use("/uploads", (req, res, next) => {
  const categoryMatch = req.path.match(/^\/category_(\d+)\//);
  if (categoryMatch) {
    return express.static(uploadsDir)(req, res, next);
  }
  next();
});

// Serve old structure
app.use("/uplods", express.static("/home/hacokw/public_html/uplods"));

// Database setup
const dbPath = process.env.DB_PATH || "./database/app.db";
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Simple in-memory cache
let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000;

const clearCache = () => {
  categoriesCache = null;
  cacheTimestamp = null;
  console.log("Cache cleared");
};

const getCache = () => {
  if (categoriesCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return categoriesCache;
  }
  return null;
};

const setCache = (data) => {
  categoriesCache = data;
  cacheTimestamp = Date.now();
};

// Initialize database tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_ar TEXT,
      description TEXT,
      description_ar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      title TEXT,
      title_ar TEXT,
      video_url TEXT,
      file_size INTEGER,
      mime_type TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title_en TEXT,
      title_ar TEXT,
      description_en TEXT,
      description_ar TEXT,
      featured INTEGER DEFAULT 0,
      location TEXT,
      video_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS property_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      title_en TEXT,
      title_ar TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      label_en TEXT,
      label_ar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_ar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const categoryId = req.body.category_id;
    
    if (categoryId) {
      const categoryFolder = path.join(uploadsDir, `category_${categoryId}`);
      
      if (!fs.existsSync(categoryFolder)) {
        fs.mkdirSync(categoryFolder, { recursive: true });
      }
      
      cb(null, categoryFolder);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = (
    process.env.ALLOWED_FILE_TYPES || "jpg,jpeg,png,gif,webp,mp4,mov,avi"
  ).split(",");
  const ext = path.extname(file.originalname).toLowerCase().substring(1);

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${ext} is not allowed`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

// JWT middleware - MUST be defined before using it
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Initialize admin user
const initializeAdmin = async () => {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  db.get(
    "SELECT * FROM admin_users WHERE username = ?",
    [username],
    async (err, row) => {
      if (err) {
        console.error("Error checking admin user:", err);
        return;
      }

      if (!row) {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
          [username, hashedPassword],
          (err) => {
            if (err) {
              console.error("Error creating admin user:", err);
            } else {
              console.log(`Admin user created: ${username}`);
            }
          }
        );
      }
    }
  );
};

// API Routes

// Admin login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    db.get(
      "SELECT * FROM admin_users WHERE username = ?",
      [username],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
        );

        res.json({
          success: true,
          token,
          user: { id: user.id, username: user.username },
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Clear cache endpoint
app.post("/api/cache/clear", authenticateToken, (req, res) => {
  clearCache();
  res.json({
    success: true,
    message: "Cache cleared successfully"
  });
});

// Get all categories with images
app.get("/api/categories", (req, res) => {
  console.log("Fetching categories...");
  
  const cachedData = getCache();
  if (cachedData && !req.query.t) {
    console.log("Serving from cache");
    return res.json(cachedData);
  }

  const categoriesQuery = `
    SELECT 
      c.id,
      c.name,
      c.name_ar,
      c.description,
      c.description_ar,
      c.created_at,
      c.updated_at
    FROM categories c
    ORDER BY c.created_at DESC
  `;

  db.all(categoriesQuery, [], (err, categories) => {
    if (err) {
      console.error("Database error fetching categories:", err);
      return res.status(500).json({ error: "Database error" });
    }

    console.log("Categories found:", categories.length);

    if (categories.length === 0) {
      setCache([]);
      return res.json([]);
    }

    const categoryIds = categories.map((cat) => cat.id);
    const placeholders = categoryIds.map(() => "?").join(",");

    const imagesQuery = `
      SELECT 
        i.id,
        i.category_id,
        i.filename,
        i.original_name,
        i.title,
        i.title_ar,
        i.video_url,
        i.image_url,
        i.created_at
      FROM images i
      WHERE i.category_id IN (${placeholders})
      ORDER BY i.created_at DESC
    `;

    db.all(imagesQuery, categoryIds, (err, images) => {
      if (err) {
        console.error("Database error fetching images:", err);
        return res.status(500).json({ error: "Database error" });
      }

      console.log("Direct images found:", images.length);

      const propertiesQuery = `
        SELECT 
          p.id,
          p.category_id,
          p.title_en,
          p.title_ar,
          p.video_url,
          p.location
        FROM properties p
        WHERE p.category_id IN (${placeholders})
      `;

      db.all(propertiesQuery, categoryIds, (err, properties) => {
        if (err) {
          console.error("Database error fetching properties:", err);
          return res.status(500).json({ error: "Database error" });
        }

        console.log("Properties found:", properties.length);

        if (properties.length === 0) {
          const imagesByCategory = {};
          images.forEach((image) => {
            if (!imagesByCategory[image.category_id]) {
              imagesByCategory[image.category_id] = [];
            }
            imagesByCategory[image.category_id].push({
              id: image.id,
              title: image.title,
              title_ar: image.title_ar,
              title_en: image.title,
              filename: image.filename,
              original_name: image.original_name,
              image_url: image.image_url || (image.filename ? `/uploads/${image.filename}` : null),
              video_url: image.video_url,
              created_at: image.created_at
            });
          });

          const result = categories.map((category) => ({
            id: category.id,
            name: category.name,
            name_ar: category.name_ar,
            name_en: category.name,
            description: category.description,
            description_ar: category.description_ar,
            description_en: category.description,
            created_at: category.created_at,
            updated_at: category.updated_at,
            images: imagesByCategory[category.id] || []
          }));

          setCache(result);
          return res.json(result);
        }

        const propertyIds = properties.map(p => p.id);
        const propPlaceholders = propertyIds.map(() => "?").join(",");

        const propertyImagesQuery = `
          SELECT 
            pi.id,
            pi.property_id,
            pi.image_url,
            pi.title_en,
            pi.title_ar,
            pi.sort_order
          FROM property_images pi
          WHERE pi.property_id IN (${propPlaceholders})
          ORDER BY pi.property_id, pi.sort_order
        `;

        db.all(propertyImagesQuery, propertyIds, (err, propertyImages) => {
          if (err) {
            console.error("Database error fetching property images:", err);
            return res.status(500).json({ error: "Database error" });
          }

          console.log("Property images found:", propertyImages.length);

          const imagesByProperty = {};
          propertyImages.forEach((img) => {
            if (!imagesByProperty[img.property_id]) {
              imagesByProperty[img.property_id] = [];
            }
            imagesByProperty[img.property_id].push(img);
          });

          const imagesByCategory = {};

          images.forEach((image) => {
            if (!imagesByCategory[image.category_id]) {
              imagesByCategory[image.category_id] = [];
            }
            imagesByCategory[image.category_id].push({
              id: image.id,
              title: image.title,
              title_ar: image.title_ar,
              title_en: image.title,
              filename: image.filename,
              original_name: image.original_name,
              image_url: image.image_url || (image.filename ? `/uploads/${image.filename}` : null),
              video_url: image.video_url,
              created_at: image.created_at
            });
          });

          properties.forEach((property) => {
            const propImages = imagesByProperty[property.id] || [];
            propImages.forEach((img) => {
              if (!imagesByCategory[property.category_id]) {
                imagesByCategory[property.category_id] = [];
              }
              imagesByCategory[property.category_id].push({
                id: `prop_${img.id}`,
                title: property.title_en,
                title_ar: property.title_ar,
                title_en: property.title_en,
                filename: null,
                image_url: img.image_url,
                video_url: property.video_url,
                location: property.location,
                created_at: img.created_at
              });
            });
          });

          const result = categories.map((category) => ({
            id: category.id,
            name: category.name,
            name_ar: category.name_ar,
            name_en: category.name,
            description: category.description,
            description_ar: category.description_ar,
            description_en: category.description,
            created_at: category.created_at,
            updated_at: category.updated_at,
            images: imagesByCategory[category.id] || []
          }));

          console.log("Returning", result.length, "categories with images");
          setCache(result);
          res.json(result);
        });
      });
    });
  });
});

// Create new category
app.post("/api/categories", authenticateToken, (req, res) => {
  const { name, name_ar, description, description_ar } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const query = `
    INSERT INTO categories (name, name_ar, description, description_ar)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [name, name_ar, description, description_ar], function (err) {
    if (err) {
      console.error("Error creating category:", err);
      return res.status(500).json({ error: "Database error" });
    }

    clearCache();
    console.log("Category created, cache cleared");

    res.json({
      success: true,
      id: this.lastID,
      message: "Category created successfully",
    });
  });
});

// Update category
app.put("/api/categories/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, name_ar, description, description_ar } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const query = `
    UPDATE categories 
    SET name = ?, name_ar = ?, description = ?, description_ar = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(
    query,
    [name, name_ar, description, description_ar, id],
    function (err) {
      if (err) {
        console.error("Error updating category:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      clearCache();
      console.log("Category updated, cache cleared");

      res.json({
        success: true,
        message: "Category updated successfully",
      });
    }
  );
});

// Delete category
app.delete("/api/categories/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.all(
    "SELECT filename FROM images WHERE category_id = ?",
    [id],
    (err, images) => {
      if (err) {
        console.error("Error fetching images:", err);
        return res.status(500).json({ error: "Database error" });
      }

      images.forEach((image) => {
        if (image.filename) {
          const filePath = path.join(uploadsDir, image.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });

      db.run("DELETE FROM categories WHERE id = ?", [id], function (err) {
        if (err) {
          console.error("Error deleting category:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: "Category not found" });
        }

        clearCache();
        console.log("Category deleted, cache cleared");

        res.json({
          success: true,
          message: "Category and associated images deleted successfully",
        });
      });
    }
  );
});

// Upload image
app.post(
  "/api/images",
  authenticateToken,
  upload.single("image"),
  (req, res) => {
    if (!req.file && !req.body.image_url) {
      return res
        .status(400)
        .json({ error: "No file uploaded or image URL provided" });
    }

    const { category_id, title, title_ar, video_url, image_url } = req.body;

    if (!category_id) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "Category ID is required" });
    }

    const filename = req.file ? req.file.filename : null;
    const originalName = req.file ? req.file.originalname : null;
    const fileSize = req.file ? req.file.size : null;
    const mimeType = req.file ? req.file.mimetype : null;
    const imageUrl = image_url || null;

    const query = `
      INSERT INTO images (category_id, filename, original_name, title, title_ar, video_url, file_size, mime_type, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        category_id,
        filename,
        originalName,
        title,
        title_ar,
        video_url,
        fileSize,
        mimeType,
        imageUrl,
      ],
      function (err) {
        if (err) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          console.error("Error uploading image:", err);
          return res.status(500).json({ error: "Database error" });
        }

        clearCache();
        console.log("Image uploaded, cache cleared");

        const responseUrl = imageUrl || `/uploads/${filename}`;

        res.json({
          success: true,
          id: this.lastID,
          filename: filename,
          image_url: imageUrl,
          url: responseUrl,
          message: "Image uploaded successfully",
        });
      }
    );
  }
);

// Delete image
app.delete("/api/images/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get("SELECT filename FROM images WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Error fetching image:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!row) {
      return res.status(404).json({ error: "Image not found" });
    }

    if (row.filename) {
      const filePath = path.join(uploadsDir, row.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.run("DELETE FROM images WHERE id = ?", [id], function (err) {
      if (err) {
        console.error("Error deleting image:", err);
        return res.status(500).json({ error: "Database error" });
      }

      clearCache();
      console.log("Image deleted, cache cleared");

      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    });
  });
});

// Get contact information
app.get("/api/contact", (req, res) => {
  const contactQuery = `
    SELECT type, value, label_en, label_ar
    FROM contact_info
    ORDER BY created_at ASC
  `;

  db.all(contactQuery, [], (err, contacts) => {
    if (err) {
      console.error("Database error fetching contact info:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const contactInfo = {};
    contacts.forEach((contact) => {
      if (!contactInfo[contact.type]) {
        contactInfo[contact.type] = [];
      }
      contactInfo[contact.type].push({
        value: contact.value,
        label_en: contact.label_en,
        label_ar: contact.label_ar,
      });
    });

    res.json(contactInfo);
  });
});

// Get companies
app.get("/api/companies", (req, res) => {
  const companiesQuery = `
    SELECT name_en, name_ar
    FROM companies
    ORDER BY created_at ASC
  `;

  db.all(companiesQuery, [], (err, companies) => {
    if (err) {
      console.error("Database error fetching companies:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(companies);
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" });
    }
  }

  console.error("Server error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  initializeAdmin();
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});