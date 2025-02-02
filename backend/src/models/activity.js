module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        description: '',
        process: '',
        goodToKnow: ''
      }
    },
    status: {
      type: DataTypes.ENUM('online', 'offline'),
      defaultValue: 'offline'
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Activity.associate = (models) => {
    Activity.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });
    Activity.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    Activity.hasMany(models.Package, {
      foreignKey: 'activityId',
      as: 'packages'
    });
    Activity.belongsToMany(models.Resource, {
      through: 'ActivityResources',
      as: 'resources'
    });
    Activity.hasMany(models.Booking, {
      foreignKey: 'activityId',
      as: 'bookings'
    });
  };

  return Activity;
};
