module.exports = (sequelize, DataTypes) => {
  const OpeningPeriod = sequelize.define('OpeningPeriod', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#000000'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    schedule: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        // Structure:
        // monday: { isOpen: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }] }
        monday: { isOpen: false, slots: [] },
        tuesday: { isOpen: false, slots: [] },
        wednesday: { isOpen: false, slots: [] },
        thursday: { isOpen: false, slots: [] },
        friday: { isOpen: false, slots: [] },
        saturday: { isOpen: false, slots: [] },
        sunday: { isOpen: false, slots: [] }
      }
    },
    activities: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  OpeningPeriod.associate = (models) => {
    OpeningPeriod.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });
  };

  return OpeningPeriod;
};
