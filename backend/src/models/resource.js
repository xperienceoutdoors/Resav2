module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ageRange: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        min: null,
        max: null
      }
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Resource.associate = (models) => {
    Resource.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });
    Resource.belongsToMany(models.Activity, {
      through: 'ActivityResources',
      as: 'activities'
    });
  };

  return Resource;
};
