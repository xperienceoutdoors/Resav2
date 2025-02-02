module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'paid', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    participants: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
      // Structure: [{ type: 'Adult', quantity: 2 }]
    },
    customerInfo: {
      type: DataTypes.JSONB,
      allowNull: false
      // Structure: { name, email, phone }
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activityId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    packageId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Activity, {
      foreignKey: 'activityId',
      as: 'activity'
    });
    Booking.belongsTo(models.Package, {
      foreignKey: 'packageId',
      as: 'package'
    });
    Booking.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });
  };

  return Booking;
};
