const fileService = require('./fileService');
const { v4: uuidv4 } = require('uuid');

exports.authenticate = (credential) => {
  const { username, email, password } = { ...credential };
  const authObj = {
    validUsername: false,
    validEmail: false,
    validPassword: false,
    isValid: false,
  };

  function add(user) {
    fileService.writeFileContents('../data/users.json', user);
  }
};
