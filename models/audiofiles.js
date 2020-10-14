module.exports = function(sequelize, DataTypes) {
    var Audiofile = sequelize.define("Audiofile", {
      audiotext: DataTypes.TEXT,
      path: DataTypes.STRING,
      // projectId: DataTypes.INTEGER
    });

    Audiofile.associate = function(models) {
      // We're saying that an Audiofile should belong to a Project
      // Audiofile can't be created without an Project due to the foreign key constraint
      Audiofile.belongsTo(models.Project, {
        foreignKey: {
          allowNull: false
        }
      });
    };
    return Audiofile;
  };