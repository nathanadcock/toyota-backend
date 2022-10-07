module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("employee", {
      employeeID: {
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      }, 
      managerID: {
        type: Sequelize.INTEGER
      },
      employmentRole: {
        type: Sequelize.STRING
      },
      departmentID: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      }
    });
  
    return Employee;
  };