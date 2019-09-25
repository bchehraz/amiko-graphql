const User = require('../../models/user');
const Post = require('../../models/post');

module.exports = {
  posts: async ({ userId }) => {
    try {
      // const user = await User.findOne({ id: userId });
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      const posts = await Post.find({ author: user });

      return posts;
    } catch (err) {
      throw err;
    }
  },
}
