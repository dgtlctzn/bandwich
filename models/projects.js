module.exports = function(sequelize, DataTypes) {
    var Project = sequelize.define("Project", {
      projectName: DataTypes.STRING,
      projectPassword: DataTypes.STRING
    });

    Project.associate = function(models) {
      // Associating Project with Audiofile
      // When a Project is deleted, also delete any associated Audiofile
      Project.hasMany(models.Audiofile, {
        onDelete: "cascade"
      });
    };
    return Project;
  };