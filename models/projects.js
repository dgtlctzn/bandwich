module.exports = function(sequelize, DataTypes) {
    var Project = sequelize.define("Project", {
      projectName: DataTypes.STRING,
      projectPassword: DataTypes.STRING
    });

    Project.associate = function(models) {
      // Associating Project with audioFiles
      // When a Project is deleted, also delete any associated audioFiles
      Project.hasMany(models.audioFiles, {
        onDelete: "cascade"
      });
    };
    return Project;
  };