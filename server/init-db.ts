import { db } from './db';
import { dbStorage } from './dbStorage';

async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    // Vérifier si les tables existent déjà
    const checkUsers = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (!checkUsers.rows[0].exists) {
      // Créer les tables si elles n'existent pas
      console.log('Tables do not exist. Creating...');
      
      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          full_name TEXT NOT NULL,
          role TEXT DEFAULT 'user'
        );
        
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          price DOUBLE PRECISION NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          threshold INTEGER DEFAULT 5,
          is_active BOOLEAN DEFAULT true
        );
        
        CREATE TABLE IF NOT EXISTS clients (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          address TEXT,
          type TEXT DEFAULT 'regular',
          total_orders INTEGER DEFAULT 0,
          total_spent DOUBLE PRECISION DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS sales (
          id SERIAL PRIMARY KEY,
          invoice_number TEXT NOT NULL,
          client_id INTEGER,
          client_name TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          total DOUBLE PRECISION NOT NULL,
          date TIMESTAMP DEFAULT NOW(),
          items JSONB NOT NULL,
          notes TEXT
        );
      `);
      
      console.log('Tables created successfully.');
      
      // Initialiser les données
      await dbStorage.initData();
      console.log('Sample data initialized successfully.');
    } else {
      console.log('Tables already exist. Skipping initialization.');
    }
    
    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Export pour utilisation dans d'autres fichiers
export { initializeDatabase };

// Si ce fichier est exécuté directement, initialiser la base de données
if (process.argv[1].includes('init-db')) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}