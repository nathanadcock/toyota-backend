module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("employee", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      managerID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      employmentRole: {
        type: Sequelize.STRING,
        allowNull: false
      },
      departmentID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    return Employee;
  };