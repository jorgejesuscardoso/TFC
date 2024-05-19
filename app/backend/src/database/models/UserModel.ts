import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';

class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare role: string;
  declare email: string;
  declare password: string;
}

UserModel.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'users', // Isso é o nome da table no banco de dados.
  timestamps: false,
});

export default UserModel;
