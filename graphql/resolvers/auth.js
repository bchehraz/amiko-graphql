const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async ({ userInput: { email, password, referral }}) => {
    try {
      const validReferrer = await User.findOne({ referralCode: referral });

      //If no valid referrer is found, throw an error.
      if (!validReferrer) {
        throw new Error('Invalid Referral Code');
      }

      //Now create a new account using the information they inputted

      //generate a random code for them which is not taken
      let newCode = '';
      while (true) {
        const generated = [
          Math.floor((Math.random() * 61)),
          Math.floor((Math.random() * 61)),
          Math.floor((Math.random() * 61)),
          Math.floor((Math.random() * 61)),
          Math.floor((Math.random() * 61))
        ];

        for (let i = 0; i < 5; i++) {
          if (generated[i] < 10) {
            newCode += String.fromCharCode(generated[i] + 48);
          } else if (generated[i] < 35) {
            newCode += String.fromCharCode(generated[i] + 65 - 10);
          } else {
            newCode += String.fromCharCode(generated[i] + 97 - 10 - 26);
          }
        }


        //Is there already a user that has this same exact referral code?
        const isReferralTaken = await User.findOne({ referralCode: newCode });

        //break out of the loop if one does not exist!
        if (!isReferralTaken) {
          break;
        }
      }

      // Check if the email is already signed up!
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new Error('User exists already.');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
        createdPosts: [],
        referralCode: newCode,
      });

      const newUser = await user.save();

      //Successful sign up means incrementing the referrer's count
      validReferrer.referralCount += 1;
      await validReferrer.save();

      const token = jwt.sign(
        { userId: newUser.id, email },
        process.env.AUTH_SECRET,
        { expiresIn: '1h' }
      );

      return {
        userId: newUser.id,
        token,
        tokenExpiration: 1,
        email
      }
    } catch (err) {
      throw err;
    }
  },
  createTestUser: async ({ userInput: { email, password }}) => {
    email = "admin";
    password = "admin";
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new Error('User exists already.');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
        createdPosts: [],
        referralCode: "ABCDE",
      });

      const newUser = await user.save();

      const token = jwt.sign(
        { userId: newUser.id, email },
        process.env.AUTH_SECRET,
        { expiresIn: '1h' }
      );

      return {
        userId: newUser.id,
        token,
        tokenExpiration: 1,
        email
      };
    } catch (err) {
      throw err;
    }
  },
}
