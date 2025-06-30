import { Sequelize } from 'sequelize';

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  // Use PostgreSQL for production
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Use SQLite for development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, connectDB };