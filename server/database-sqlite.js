const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'plsp_repository.db');
const db = new sqlite3.Database(dbPath);

const initDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create projects table
      db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        authors TEXT NOT NULL,
        adviser TEXT,
        year INTEGER NOT NULL,
        abstract TEXT,
        keywords TEXT,
        department TEXT NOT NULL,
        project_type TEXT NOT NULL,
        status TEXT DEFAULT 'completed',
        pdf_filename TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create achievements table
      db.run(`CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image_filename TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create password_resets table
      db.run(`CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Insert default admin user
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT OR IGNORE INTO users (username, email, password, role) 
              VALUES ('admin', 'admin@plsp.edu.ph', ?, 'admin')`, [hashedPassword], (err) => {
        if (err) {
          console.error('Error creating admin user:', err);
        } else {
          console.log('✅ Default admin user created (username: admin, password: admin123)');
        }
      });

      console.log('✅ SQLite database initialized successfully');
      resolve();
    });
  });
};

// Wrapper functions to match Supabase API
const supabaseWrapper = {
  from: (table) => ({
    select: (columns = '*') => {
      const baseQuery = {
        eq: (column, value) => ({
          eq: (column2, value2) => new Promise((resolve, reject) => {
            const query = `SELECT ${columns} FROM ${table} WHERE ${column} = ? AND ${column2} = ?`;
            db.all(query, [value, value2], (err, rows) => {
              if (err) resolve({ data: null, error: err });
              else resolve({ data: rows, error: null });
            });
          }),
          limit: (limit) => new Promise((resolve, reject) => {
            const query = `SELECT ${columns} FROM ${table} WHERE ${column} = ? LIMIT ?`;
            db.all(query, [value, limit], (err, rows) => {
              if (err) resolve({ data: null, error: err });
              else resolve({ data: rows, error: null });
            });
          }),
          single: () => new Promise((resolve, reject) => {
            const query = `SELECT ${columns} FROM ${table} WHERE ${column} = ? LIMIT 1`;
            db.get(query, [value], (err, row) => {
              if (err) resolve({ data: null, error: err });
              else resolve({ data: row, error: null });
            });
          }),
          then: (callback) => {
            return new Promise((resolve, reject) => {
              const query = `SELECT ${columns} FROM ${table} WHERE ${column} = ?`;
              db.all(query, [value], (err, rows) => {
                if (err) resolve({ data: null, error: err });
                else resolve({ data: rows, error: null });
              });
            }).then(callback);
          }
        }),
        or: (condition) => ({
          limit: (limit) => new Promise((resolve, reject) => {
            // Parse condition like "username.eq.value,email.eq.value"
            const parts = condition.split(',');
            const conditions = parts.map(part => {
              const [field, op, val] = part.split('.');
              return `${field} = ?`;
            }).join(' OR ');
            const values = parts.map(part => part.split('.')[2]);
            
            const query = `SELECT ${columns} FROM ${table} WHERE ${conditions} LIMIT ?`;
            db.all(query, [...values, limit], (err, rows) => {
              if (err) resolve({ data: null, error: err });
              else resolve({ data: rows, error: null });
            });
          })
        }),
        order: (column, options = {}) => ({
          then: (callback) => {
            const orderDir = options.ascending === false ? 'DESC' : 'ASC';
            const query = `SELECT ${columns} FROM ${table} ORDER BY ${column} ${orderDir}`;
            return new Promise((resolve, reject) => {
              db.all(query, [], (err, rows) => {
                if (err) resolve({ data: null, error: err });
                else resolve({ data: rows, error: null });
              });
            }).then(callback);
          }
        }),
        limit: (limit) => new Promise((resolve, reject) => {
          const query = `SELECT ${columns} FROM ${table} LIMIT ?`;
          db.all(query, [limit], (err, rows) => {
            if (err) resolve({ data: null, error: err });
            else resolve({ data: rows, error: null });
          });
        }),
        then: (callback) => {
          return new Promise((resolve, reject) => {
            const query = `SELECT ${columns} FROM ${table}`;
            db.all(query, [], (err, rows) => {
              if (err) resolve({ data: null, error: err });
              else resolve({ data: rows, error: null });
            });
          }).then(callback);
        }
      };
      
      // Make the base query thenable
      baseQuery.then = (callback) => {
        return new Promise((resolve, reject) => {
          const query = `SELECT ${columns} FROM ${table}`;
          db.all(query, [], (err, rows) => {
            if (err) resolve({ data: null, error: err });
            else resolve({ data: rows, error: null });
          });
        }).then(callback);
      };
      
      return baseQuery;
    },
    insert: (data) => new Promise((resolve, reject) => {
      const record = Array.isArray(data) ? data[0] : data;
      const keys = Object.keys(record);
      const placeholders = keys.map(() => '?').join(',');
      const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
      const values = keys.map(key => record[key]);
      
      db.run(query, values, function(err) {
        if (err) resolve({ data: null, error: err });
        else resolve({ data: { id: this.lastID }, error: null });
      });
    }),
    update: (data) => ({
      eq: (column, value) => new Promise((resolve, reject) => {
        const keys = Object.keys(data);
        const setClause = keys.map(key => `${key} = ?`).join(',');
        const query = `UPDATE ${table} SET ${setClause} WHERE ${column} = ?`;
        const values = [...keys.map(key => data[key]), value];
        
        db.run(query, values, (err) => {
          if (err) resolve({ data: null, error: err });
          else resolve({ data: null, error: null });
        });
      })
    }),
    delete: () => ({
      eq: (column, value) => new Promise((resolve, reject) => {
        const query = `DELETE FROM ${table} WHERE ${column} = ?`;
        
        db.run(query, [value], (err) => {
          if (err) resolve({ data: null, error: err });
          else resolve({ data: null, error: null });
        });
      })
    })
  })
};

module.exports = { 
  supabase: supabaseWrapper, 
  initDatabase,
  db // Export raw db for complex queries
};
