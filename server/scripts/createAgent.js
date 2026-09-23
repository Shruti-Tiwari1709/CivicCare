const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

dotenv.config();

const createAgent = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAgent = await User.findOne({
      email: "agent@civiccare.com",
    });

    if (existingAgent) {
      console.log("Agent already exists!");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("agent123", 10);

    await User.create({
      name: "CivicCare Agent",
      email: "agent@civiccare.com",
      password: hashedPassword,
      role: "agent",
    });

    console.log("Agent created successfully!");
    process.exit();
  } catch (error) {
    console.error("Error creating agent:", error.message);
    process.exit(1);
  }
};

createAgent();