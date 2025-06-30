import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';

class HealthRecord extends Model {
  public id!: number;
  public userId!: number;
  public fileName!: string;
  public content!: string;
  public summary?: string;
  public status!: 'pending' | 'processing' | 'completed' | 'failed';
}

HealthRecord.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  summary: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  sequelize,
  modelName: 'HealthRecord',
});

User.hasMany(HealthRecord, { foreignKey: 'userId' });
HealthRecord.belongsTo(User, { foreignKey: 'userId' });

export default HealthRecord;