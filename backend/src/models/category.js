module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Category.associate = (models) => {
    Category.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });
    Category.hasMany(models.Activity, {
      foreignKey: 'categoryId',
      as: 'activities'
    });
  };

  return Category;
};
