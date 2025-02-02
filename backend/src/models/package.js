module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define('Package', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in minutes
      allowNull: false
    },
    departureTimes: {
      type: DataTypes.ARRAY(DataTypes.TIME),
      defaultValue: []
    },
    prices: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
      // Structure: [{ name: 'Adult', price: 2000, vat: 20 }]
    },
    activityId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Package.associate = (models) => {
    Package.belongsTo(models.Activity, {
      foreignKey: 'activityId',
      as: 'activity'
    });
    Package.hasMany(models.Booking, {
      foreignKey: 'packageId',
      as: 'bookings'
    });
  };

  return Package;
};
