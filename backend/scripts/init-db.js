const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database/app.db';
const dbDir = path.dirname(dbPath);

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

async function initializeDatabase() {
  console.log('Initializing database...');

  db.serialize(async () => {
    // Create categories table
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

    // Create properties table (المطلوبة في الكود)
    db.run(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        title_en TEXT,
        title_ar TEXT,
        description_en TEXT,
        description_ar TEXT,
        location TEXT,
        video_url TEXT,
        featured INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      )
    `);

    // Create property_images table (المطلوبة في الكود)
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

    // Create contact_info table (المطلوبة في الكود)
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

    // Create companies table (المطلوبة في الكود)
    db.run(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_en TEXT NOT NULL,
        name_ar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create images table (الأصلية)
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      )
    `);

    // Create admin_users table
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin user
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`
      INSERT OR REPLACE INTO admin_users (username, password_hash)
      VALUES (?, ?)
    `, [username, hashedPassword], function(err) {
      if (err) {
        console.error('Error creating admin user:', err);
      } else {
        console.log(`✅ Admin user created/updated: ${username}`);
      }
    });

    // Insert sample categories
    const sampleCategories = [
      {
        name: 'Current Properties',
        name_ar: 'العقارات الحالية',
        description: 'Currently managed properties',
        description_ar: 'العقارات المُدارة حالياً'
      },
      {
        name: 'Complexes',
        name_ar: 'المجمعات',
        description: 'Commercial and residential complexes',
        description_ar: 'المجمعات التجارية والسكنية'
      },
      {
        name: 'Residential',
        name_ar: 'السكنية',
        description: 'Residential properties and villas',
        description_ar: 'العقارات السكنية والفيلل'
      }
    ];

    let completed = 0;
    sampleCategories.forEach((category, index) => {
      db.run(`
        INSERT OR IGNORE INTO categories (name, name_ar, description, description_ar)
        VALUES (?, ?, ?, ?)
      `, [category.name, category.name_ar, category.description, category.description_ar], function(err) {
        if (err) {
          console.error('Error inserting category:', err);
        } else {
          console.log(`✅ Category created: ${category.name}`);
        }
        completed++;
        if (completed === sampleCategories.length) {
          // Insert sample contact info
          const sampleContacts = [
            { type: 'phone', value: '+966-XX-XXX-XXXX', label_en: 'Main Office', label_ar: 'المكتب الرئيسي' },
            { type: 'email', value: 'info@hamedawadh.com', label_en: 'General Info', label_ar: 'معلومات عامة' },
            { type: 'address', value: 'Riyadh, Saudi Arabia', label_en: 'Main Office', label_ar: 'المكتب الرئيسي' }
          ];

          sampleContacts.forEach(contact => {
            db.run(`
              INSERT OR IGNORE INTO contact_info (type, value, label_en, label_ar)
              VALUES (?, ?, ?, ?)
            `, [contact.type, contact.value, contact.label_en, contact.label_ar]);
          });

          console.log('✅ Database initialized successfully!');
          console.log(`📊 Admin credentials: ${username} / ${password}`);
          console.log('⚠️  Please change the default password in production!');
          
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
            } else {
              console.log('Database connection closed.');
            }
            process.exit(0);
          });
        }
      });
    });
  });
}

initializeDatabase().catch(console.error);  