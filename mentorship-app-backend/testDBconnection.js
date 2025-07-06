const sequelize = require('./config/database');

sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL database successful!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
