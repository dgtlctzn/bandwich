module.exports = function(sequelize, DataTypes) {
    var audioFiles = sequelize.define("audioFiles", {
      audioFile: DataTypes.LONGTEXT,
      path: DataTypes.STRING,
      projectId: DataTypes.INTEGER
    });
    return audioFiles;
  };