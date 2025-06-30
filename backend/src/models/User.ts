import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class User extends Model {
  public id!: number;
  public email!: string;
  public name!: string;
  public provider!: 'google' | 'apple';
  public providerId!: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  providerId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'User',
});

export default User;