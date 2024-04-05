require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Verwijst naar je Mongoose User model

class AuthService {
  async register(userData) {
    // Controleer of de gebruiker al bestaat
    let user = await User.findOne({ email: userData.email });
    if (user) {
      throw new Error("User already exists");
    }

    // Hash het wachtwoord
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Creëer een nieuwe gebruiker
    user = new User({
      email: userData.email,
      password: hashedPassword,
      isOwner: userData.isOwner,
    });

    // Sla de gebruiker op in de database
    await user.save();

    // Genereer een JWT token voor de nieuwe gebruiker
    const token = this.generateToken(user);

    // Retourneer de gebruiker en token
    return { user, token };
  }

  async login(email, password) {
    // Vind de gebruiker op basis van e-mail
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist");
    }

    // Controleer het wachtwoord
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Genereer een JWT token
    const token = this.generateToken(user);

    // Retourneer de gebruiker en token
    return { user, token };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email, isOwner: user.isOwner },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }
}

module.exports = AuthService;
