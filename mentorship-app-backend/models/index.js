const User = require('./user');
const Request = require('./Request');
const Availability = require('./availability'); 

// Associations
User.hasMany(Request, { foreignKey: 'menteeId', as: 'menteeRequests' });
User.hasMany(Request, { foreignKey: 'mentorId', as: 'mentorRequests' });
Request.belongsTo(User, { foreignKey: 'menteeId', as: 'mentee' });
Request.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });

// // ✅ Add this:
// User.hasMany(Availability, { foreignKey: 'userId', as: 'availabilities' });
// Availability.belongsTo(User, { foreignKey: 'userId' }); // optional, but good practice


module.exports = {
  User,
  Request,
  Availability
};
