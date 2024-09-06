// Import necessary modules
const { createConnection } = require('typeorm');
require('reflect-metadata');

// Create and export the database connection
const connectDatabase = async () => {
  try {
    const connection = await createConnection({
      type: 'mysql',
      host: 'localhost',       
      port: 3306,              
      username: 'root',
      password: 'Gurpreet@1999',
      database: 'aerialborne',
     
      entities: ['./entities/**/*.js'],
      synchronize: true,        
      logging: false,           
    });
    
    console.log('Database connected successfully!');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

module.exports = connectDatabase;
