require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("./models/User");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  // Delete existing admin
  await User.deleteOne({ email: "admin@gmail.com" });
  console.log("Cleared old admin");

  // Create with pre-hashed password to avoid any issues
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await User.collection.insertOne({
    name: "Nosratee Jahan Naba",
    email: "admin@gmail.com",
    studentId: "ADMIN001",
    password: hashedPassword,
    role: "admin",
    isApproved: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("  Admin created!");
  console.log("  Email:    admin@gmail.com");
  console.log("  Password: admin123");
  mongoose.disconnect();
}
main().catch(console.error);
