module.exports = function(sequelize, DataTypes) {
    var audioFiles = sequelize.define("audioFiles", {
      audioFile: DataTypes.LONGTEXT,
      path: DataTypes.STRING,
      projectId: DataTypes.INTEGER
    });

    audioFiles.associate = function(models) {
      // We're saying that an audioFiles should belong to a Project
      // audioFiles can't be created without an Project due to the foreign key constraint
      audioFiles.belongsTo(models.Project, {
        foreignKey: {
          allowNull: false
        }
      });
    };
    return audioFiles;
  };