const postResolver = require('./post');
const authResolver = require('./auth');

const rootResolver = {
  ...postResolver,
  ...authResolver,
};

module.exports = rootResolver;
