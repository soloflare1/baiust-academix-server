require("dotenv").config();
const mongoose = require("mongoose");
const User     = require("./models/User");
const Resource = require("./models/Resource");

const seedData = [
  { title:"Introduction to Algorithms — Cormen 4th Edition", type:"book", semId:"1.1", course:"CSE-1101", level:1, term:1, description:"Standard algorithms textbook." },
  { title:"C Programming Lecture Notes Week 1-6", type:"note", semId:"1.1", course:"CSE-1101", level:1, term:1, description:"Complete lecture notes on C programming." },
  { title:"C Programming Full Course — FreeCodeCamp", type:"video", semId:"1.1", course:"CSE-1101", level:1, term:1, fileUrl:"https://www.youtube.com/watch?v=KJgsSFOSQv0", description:"Beginner to advanced C tutorial." },
  { title:"Discrete Mathematics — Kenneth Rosen 7th Edition", type:"book", semId:"1.1", course:"MATH-1101", level:1, term:1, description:"Standard discrete math reference." },
  { title:"Object-Oriented Programming in Java — Herbert Schildt", type:"book", semId:"1.2", course:"CSE-1201", level:1, term:2, description:"Complete Java OOP reference." },
  { title:"Java OOP Lecture Notes", type:"note", semId:"1.2", course:"CSE-1201", level:1, term:2, description:"Notes on classes, inheritance and polymorphism." },
  { title:"Data Structures — Mark Allen Weiss", type:"book", semId:"2.1", course:"CSE-2101", level:2, term:1, description:"DSA reference with C++ implementations." },
  { title:"DSA Lecture Notes — Arrays, Trees, Graphs", type:"note", semId:"2.1", course:"CSE-2101", level:2, term:1, description:"Complete data structures notes." },
  { title:"Data Structures Full Course — Abdul Bari", type:"video", semId:"2.1", course:"CSE-2101", level:2, term:1, fileUrl:"https://www.youtube.com/watch?v=RBSGKlAvoiM", description:"Highly recommended DSA course." },
  { title:"Database System Concepts — Silberschatz 7th Edition", type:"book", semId:"2.2", course:"CSE-2203", level:2, term:2, description:"The definitive DBMS textbook." },
  { title:"SQL and Normalisation Notes", type:"note", semId:"2.2", course:"CSE-2203", level:2, term:2, description:"Notes with ER diagrams and SQL queries." },
  { title:"Operating System Concepts — Silberschatz 10th Edition", type:"book", semId:"3.1", course:"CSE-3101", level:3, term:1, description:"The dinosaur book." },
  { title:"OS Lecture Notes — Process and Memory Management", type:"note", semId:"3.1", course:"CSE-3101", level:3, term:1, description:"Notes on scheduling and memory." },
  { title:"Computer Networks — Tanenbaum 5th Edition", type:"book", semId:"3.1", course:"CSE-3103", level:3, term:1, description:"Standard networking textbook." },
  { title:"Computer Networks Notes — OSI and TCP/IP", type:"note", semId:"3.1", course:"CSE-3103", level:3, term:1, description:"Notes on protocols and IP addressing." },
  { title:"Software Engineering — Ian Sommerville 10th Edition", type:"book", semId:"3.2", course:"CSE-3201", level:3, term:2, description:"Standard SE reference." },
  { title:"SDLC and UML Diagram Notes", type:"note", semId:"3.2", course:"CSE-3201", level:3, term:2, description:"Notes on software development lifecycle." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("[DB] Connected");
  const admin = await User.findOne({ role: "admin" });
  if (!admin) { console.error("No admin found. Run createAdmin.js first."); process.exit(1); }
  await Resource.deleteMany({});
  console.log("[Seed] Cleared existing resources");
  const resources = seedData.map(r => ({ ...r, status:"approved", uploadedBy:admin._id, fileUrl:r.fileUrl||"" }));
  await Resource.insertMany(resources);
  console.log(`[Seed] Inserted ${resources.length} resources`);
  mongoose.disconnect();
  console.log("[Seed] Done!");
}
seed().catch(err => { console.error(err); process.exit(1); });
