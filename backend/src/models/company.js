module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'inactive'
    },
    subscriptionType: {
      type: DataTypes.ENUM('monthly', 'annual'),
      allowNull: true
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Company.associate = (models) => {
    Company.hasMany(models.Activity, {
      foreignKey: 'companyId',
      as: 'activities'
    });
    Company.hasMany(models.Resource, {
      foreignKey: 'companyId',
      as: 'resources'
    });
    Company.hasMany(models.Category, {
      foreignKey: 'companyId',
      as: 'categories'
    });
    Company.hasMany(models.OpeningPeriod, {
      foreignKey: 'companyId',
      as: 'openingPeriods'
    });
  };

  return Company;
};
