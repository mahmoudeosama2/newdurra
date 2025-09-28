const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database/app.db';
const db = new sqlite3.Database(dbPath);

// All the static content from your frontend
const staticContent = {
  // Contact information
  contact: {
    phones: ['+965 2226 9915', '+965 2226 9916', '+965 2226 9917'],
    emails: ['info@hamedawadh-int.com'],
    whatsapp: '+96599615116',
    instagram: 'https://www.instagram.com/eldurraworld/',
    address: {
      en: 'Kuwait - Al-Mirqab - Khalid Bin Al-Waleed Street\nMazaya Tower 1 - 11th Floor',
      ar: 'الكويت - المرقاب - شارع خالد بن الوليد\nبرج مزايا 1 - الدور 11'
    },
    coordinates: '29.3743,47.9894'
  },

  // Company information
  companies: [
    { name_en: 'Hamed Awadh CO', name_ar: 'شركة حامد عوض' },
    { name_en: 'WORLD DURRA CO', name_ar: 'شركة درة العالم' },
    { name_en: 'Gulf Durra Co', name_ar: 'شركة درة الخليج' }
  ],

  // Categories with their properties
  categories: [
    {
      name_en: 'Current Properties',
      name_ar: 'العقارات الحالية',
      description_en: 'Currently managed properties',
      description_ar: 'العقارات المُدارة حالياً',
      properties: [
        {
          title_en: 'Jabriya Mall & Hotel',
          title_ar: 'مول وفندق الجابرية',
          description_en: 'Al-Jabriya Hotel Project - One of our most important pioneering projects with a comprehensive gallery of more than 34 images and an explanatory video.',
          description_ar: 'مشروع فندق الجابرية - أحد أهم مشاريعنا الرائدة مع معرض شامل يضم أكثر من 34 صورة وفيديو توضيحي',
          featured: true,
          video_url: 'https://hacokw.com/uplods/videos/aljabria-video.mp4',
          images: [
            'https://hacokw.com/uplods/Images/jabriya.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/asd.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/asdd.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/casc.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/cx.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/dds.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/ew.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/fs.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/hf.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/hhf.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/jhg.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/jj.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/mb.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/re.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/Screenshot 2025-07-29 165559.png',
            'https://hacokw.com/uplods/Images/aljabriahotel/Screenshot 2025-07-29 170035.png',
            'https://hacokw.com/uplods/Images/aljabriahotel/Screenshot 2025-07-29 170427.png',
            'https://hacokw.com/uplods/Images/aljabriahotel/vcvcv.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/vvc.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/vvcvx.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.53_9f302c48.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.53_77e9edfb.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.53_94b1c07a.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.54_4a009ce5.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.54_04b4a11c.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.54_9ed7b2c2.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.54_b65989e5.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.55_7b5872aa.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.55_df663050.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.56_7842b42a.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.56_c9a5ffee.jpg',
            'https://hacokw.com/uplods/Images/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.56_ce9dc41d.jpg',
            'https://hacokw.com/uplods/Images/3.jpg',
            'https://hacokw.com/uplods/Images/4.jpg',
            'https://hacokw.com/uplods/Images/5.jpg',
            'https://hacokw.com/uplods/Images/6.jpg'
          ]
        }
      ]
    },
    {
      name_en: 'Alrayaan Complex Salmiyah',
      name_ar: 'مجمع الريان السالمية',
      description_en: 'Alrayaan Complex in Salmiya area',
      description_ar: 'مجمع الريان في منطقة السالمية',
      properties: [
        {
          title_en: 'Alrayaan Complex',
          title_ar: 'مجمع الريان',
          location: 'https://maps.app.goo.gl/n7ZhwdxmRNbRTKe7A',
          images: [
            'https://hacokw.com/uplods/Images/alrayaancomplexsalmiyah/alryan5.jpg',
            'https://hacokw.com/uplods/Images/alrayaancomplexsalmiyah/alryan6.jpg',
            'https://hacokw.com/uplods/Images/alrayaancomplexsalmiyah/alryan8.jpg'
          ]
        }
      ]
    },
    {
      name_en: 'Bnid Al-Qar Complex',
      name_ar: 'مجمع بنيد القار',
      description_en: 'Bnid Al-Qar residential and commercial complex',
      description_ar: 'مجمع بنيد القار السكني والتجاري',
      properties: [
        {
          title_en: 'Bnid Al-Qar Complex',
          title_ar: 'مجمع بنيد القار',
          images: [
            'https://hacokw.com/uplods/Images/bnidalqar/bned1.jpg',
            'https://hacokw.com/uplods/Images/bnidalqar/bned2.jpg'
          ]
        }
      ]
    },
    {
      name_en: 'La Plage Complex - Arabian Gulf Street',
      name_ar: 'مجمع البلاج شارع الخليج العربي',
      description_en: 'La Plage Complex on Arabian Gulf Street',
      description_ar: 'مجمع البلاج على شارع الخليج العربي',
      properties: [
        {
          title_en: 'La Plage Complex',
          title_ar: 'مجمع البلاج',
          location: 'https://maps.app.goo.gl/n3va1GHMwC6Q9AVdA',
          images: [
            'https://hacokw.com/uplods/Images/lablagcomplex/lablag1.jpg',
            'https://hacokw.com/uplods/Images/lablagcomplex/lablag2.jpg'
          ]
        }
      ]
    },
    {
      name_en: 'Mahbullah Complex',
      name_ar: 'مجمع المهبولة',
      description_en: 'Mahbullah residential complex',
      description_ar: 'مجمع المهبولة السكني',
      properties: [
        {
          title_en: 'Mahbullah Complex',
          title_ar: 'مجمع المهبولة',
          location: 'https://maps.app.goo.gl/SwHvnd4NYuNvPEJ68',
          images: [
            'https://hacokw.com/uplods/Images/mahbullahcomplex/mahboula3.jpg',
            'https://hacokw.com/uplods/Images/mahbullahcomplex/mahboula4.jpg'
          ]
        }
      ]
    },
    {
      name_en: 'Residential Houses and Villas',
      name_ar: 'بيوت وفلل سكنية',
      description_en: 'Premium residential villas and houses',
      description_ar: 'فلل وبيوت سكنية متميزة',
      properties: [
        {
          title_en: 'Residential Villas',
          title_ar: 'الفلل السكنية',
          location: 'https://maps.app.goo.gl/dFJEcctsmeZQeoMQ6',
          images: [
            'https://hacokw.com/uplods/Images/residentialvillasandhouses/romisia3.jpg',
            'https://hacokw.com/uplods/Images/residentialvillasandhouses/salwa7.jpg',
            'https://hacokw.com/uplods/Images/residentialvillasandhouses/romisia7.jpg',
            'https://hacokw.com/uplods/Images/residentialvillasandhouses/romisia9.jpg',
            'https://hacokw.com/uplods/Images/residentialvillasandhouses/romisia12.jpg',
            'https://hacokw.com/uplods/Images/mahbullah216/mahboula1.jpg'
          ]
        }
      ]
    },
    {
      name_en: 'Previously Managed Properties',
      name_ar: 'عقارات سابقة تم إدارتها',
      description_en: 'Properties previously managed by our company',
      description_ar: 'عقارات تم إدارتها سابقاً من قبل شركتنا',
      properties: [
        {
          title_en: 'Al Hamra Residence',
          title_ar: 'الحمرا ريزيدنس',
          images: [
            'https://hacokw.com/uplods/Images/previous-managed/hamra-residence-1.jpg',
            'https://hacokw.com/uplods/Images/previous-managed/hamra-residence-3.jpg',
            'https://hacokw.com/uplods/Images/previous-managed/hamra-residence-4.jpg'
          ]
        },
        {
          title_en: 'Al Salam Mall',
          title_ar: 'السلام مول',
          images: [
            'https://hacokw.com/uplods/Images/previous-managed/salam-mall-2.jpg',
            'https://hacokw.com/uplods/Images/previous-managed/salam-mall-4.jpg',
            'https://hacokw.com/uplods/Images/previous-managed/salam-mall-6.jpg',
            'https://hacokw.com/uplods/Images/previous-managed/salam-mall-7.jpg',
            'https://hacokw.com/uplods/Images/previous-managed/salam-mall-8.jpg'
          ]
        }
      ]
    },
    {
      name_en: 'Construction and Renovation Projects',
      name_ar: 'عقارات تم إنشاؤها وترميمها',
      description_en: 'Construction and renovation projects completed',
      description_ar: 'مشاريع البناء والترميم المكتملة',
      properties: [
        {
          title_en: 'Hawally Carte Blanche',
          title_ar: 'حولي كارت بلانش',
          location: 'https://maps.app.goo.gl/aEMH9R7P6fSxadVPA',
          images: [
            'https://hacokw.com/uplods/Images/construction-renovation/cartblanche-2.jpg',
            'https://hacokw.com/uplods/Images/construction-renovation/cartblanche-3.jpg'
          ]
        },
        {
          title_en: 'Shuab Al Bahri Medical Clinics',
          title_ar: 'عيادات طبية الشعب البحري',
          location: 'https://maps.app.goo.gl/4HxqXRS89skExD6P9',
          images: [
            'https://hacokw.com/uplods/Images/construction-renovation/medical-clinic-1.jpg',
            'https://hacokw.com/uplods/Images/construction-renovation/medical-clinic.jpg'
          ]
        }
      ]
    }
  ]
};

async function migrateContent() {
  console.log('Starting content migration...');

  db.serialize(() => {
    // Create new tables for dynamic content
    
    // Contact information table
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

    // Companies table
    db.run(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_en TEXT NOT NULL,
        name_ar TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Properties table (enhanced)
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
        featured BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      )
    `);

    // Property images table (separate from general images)
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

    // Insert contact information
    const contactStmt = db.prepare(`
      INSERT OR REPLACE INTO contact_info (type, value, label_en, label_ar)
      VALUES (?, ?, ?, ?)
    `);

    // Insert phone numbers
    staticContent.contact.phones.forEach(phone => {
      contactStmt.run('phone', phone, 'Phone', 'الهاتف');
    });

    // Insert emails
    staticContent.contact.emails.forEach(email => {
      contactStmt.run('email', email, 'Email', 'البريد الإلكتروني');
    });

    // Insert WhatsApp
    contactStmt.run('whatsapp', staticContent.contact.whatsapp, 'WhatsApp', 'واتساب');

    // Insert Instagram
    contactStmt.run('instagram', staticContent.contact.instagram, 'Instagram', 'إنستغرام');

    // Insert address
    contactStmt.run('address_en', staticContent.contact.address.en, 'Address', 'العنوان');
    contactStmt.run('address_ar', staticContent.contact.address.ar, 'Address', 'العنوان');

    // Insert coordinates
    contactStmt.run('coordinates', staticContent.contact.coordinates, 'Coordinates', 'الإحداثيات');

    contactStmt.finalize();

    // Insert companies
    const companyStmt = db.prepare(`
      INSERT OR REPLACE INTO companies (name_en, name_ar)
      VALUES (?, ?)
    `);

    staticContent.companies.forEach(company => {
      companyStmt.run(company.name_en, company.name_ar);
    });

    companyStmt.finalize();

    // Insert categories and properties
    staticContent.categories.forEach(category => {
      db.run(`
        INSERT OR REPLACE INTO categories (name, name_ar, description, description_ar)
        VALUES (?, ?, ?, ?)
      `, [category.name_en, category.name_ar, category.description_en, category.description_ar], function(err) {
        if (err) {
          console.error('Error inserting category:', err);
          return;
        }

        const categoryId = this.lastID;
        console.log(`Inserted category: ${category.name_en} with ID: ${categoryId}`);

        // Insert properties for this category
        category.properties.forEach(property => {
          db.run(`
            INSERT INTO properties (category_id, title_en, title_ar, description_en, description_ar, location, video_url, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            categoryId,
            property.title_en,
            property.title_ar,
            property.description_en || null,
            property.description_ar || null,
            property.location || null,
            property.video_url || null,
            property.featured ? 1 : 0
          ], function(err) {
            if (err) {
              console.error('Error inserting property:', err);
              return;
            }

            const propertyId = this.lastID;
            console.log(`Inserted property: ${property.title_en} with ID: ${propertyId}`);

            // Insert images for this property
            if (property.images && property.images.length > 0) {
              const imageStmt = db.prepare(`
                INSERT INTO property_images (property_id, image_url, sort_order)
                VALUES (?, ?, ?)
              `);

              property.images.forEach((imageUrl, index) => {
                imageStmt.run(propertyId, imageUrl, index);
              });

              imageStmt.finalize();
              console.log(`Inserted ${property.images.length} images for property: ${property.title_en}`);
            }
          });
        });
      });
    });

    console.log('Content migration completed successfully!');
  });
}

migrateContent().catch(console.error);