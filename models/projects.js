module.exports = function(sequelize, DataTypes) {
    var Project = sequelize.define("Project", {
      projectName: DataTypes.STRING,
      projectPassword: DataTypes.STRING
    });
    return Project;
  };