require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const portfolioSchema = new mongoose.Schema({
  profile: { name:String, headline:String, bio:String, about:String },
  contact: { email:String, github:String, linkedin:String, resume:String },
  education: [{ title:String, institution:String, period:String, link:String }],
  experience: [{ role:String, company:String, period:String, location:String, description:String }],
  skills: { technical:[String], web:[String], other:[String] },
  projects: [{ title:String, category:String, image:String, github:String, description:String, technologies:[String], features:[String] }],
  futureProjects: [{ title:String, status:String, description:String }]
}, { timestamps:true });

const adminSchema = new mongoose.Schema({ email:{type:String,unique:true}, passwordHash:String });
const Portfolio = mongoose.model("Portfolio", portfolioSchema);
const Admin = mongoose.model("Admin", adminSchema);

function auth(req,res,next){
  const header=req.headers.authorization||"";
  const token=header.startsWith("Bearer ")?header.slice(7):null;
  if(!token) return res.status(401).json({message:"Authentication required"});
  try{req.admin=jwt.verify(token,process.env.JWT_SECRET);next()}
  catch{return res.status(401).json({message:"Invalid or expired token"})}
}

app.post("/api/auth/login", async (req,res)=>{
  try{
    const {email,password}=req.body;
    const admin=await Admin.findOne({email});
    if(!admin || !(await bcrypt.compare(password,admin.passwordHash))) return res.status(401).json({message:"Invalid email or password"});
    const token=jwt.sign({id:admin._id,email:admin.email},process.env.JWT_SECRET,{expiresIn:"4h"});
    res.json({token});
  }catch(e){res.status(500).json({message:"Login failed"})}
});

app.get("/api/portfolio", async(req,res)=>{
  try{
    let data=await Portfolio.findOne().lean();
    if(!data) data=await Portfolio.create(seedPortfolio);
    res.json(data);
  }catch(e){res.status(500).json({message:"Could not load portfolio"})}
});

app.put("/api/portfolio", auth, async(req,res)=>{
  try{
    const current=await Portfolio.findOne();
    if(!current) return res.status(404).json({message:"Portfolio not found"});
    Object.assign(current,req.body);
    await current.save();
    res.json(current);
  }catch(e){res.status(400).json({message:"Could not save portfolio"})}
});

const seedPortfolio = {
  profile:{name:"Venuri V.",headline:"BIT & BSc undergraduate",bio:"A BIT and BSc undergraduate passionate about technology, software development, and building practical digital solutions.",about:"I am an undergraduate currently pursuing a Bachelor of Information Technology (BIT) and a Bachelor of Science in Physical Science-ICT."},
  contact:{email:"venurivethmini2005@gmail.com",github:"https://github.com/venula-poetisa",linkedin:"https://www.linkedin.com/in/venuri-vethmini-04157228a",resume:"content/cv.pdf"},
  education:[
    {title:"Bachelor of Information Technology",institution:"University of Colombo School of Computing (UCSC)",period:"Current",link:"https://bit.lk"},
    {title:"BSc. Physical Science - Information and Communication Technology",institution:"University of Sri Jayewardenepura",period:"Current",link:"https://science.sjp.ac.lk/information-and-communication-technology-ict/"},
    {title:"G.C.E. Advanced Level - ICT, Combined Mathematics & Physics",institution:"",period:"A/L",link:""}
  ],
  experience:[
    {role:"Data Annotator - Freelancing",company:"Innodata Inc.",period:"Feb 2026",location:"Remote",description:"Labeling and evaluating visual and multimedia content for AI training datasets, ensuring accuracy, consistency, and overall quality."},
    {role:"Intern - Centralized Credit Documentation Unit",company:"Sampath Bank PLC",period:"Oct 2024 - Apr 2025",location:"",description:"Prepared and processed documents involving sensitive client and company data, coordinated branch submissions, and worked with officers under high-volume deadlines."}
  ],
  skills:{
    technical:["Java","Java OOP","JDBC","MySQL","Java Swing"],
    web:["HTML","CSS","JavaScript","PHP","MERN Stack","MongoDB"],
    other:["Data Annotation","Analytical Problem Solving","Attention to Detail","Teamwork","Git","GitHub","REST APIs"]
  },
  projects:[
    {title:"Sales Management System",category:"Desktop Application",image:"content/project1.png",github:"https://github.com/venula-poetisa",description:"A Java desktop application for managing products, customers, sales transactions, stock quantities and invoices.",technologies:["Java","Java Swing","JDBC","MySQL"],features:["User authentication and login","Product and customer management","Sales processing and stock updates","Discount calculation and invoice generation"]},
    {title:"Dog Hostel Website",category:"Web Development",image:"content/project2.png",github:"",description:"A responsive website built around a dog-hostel concept using core front-end technologies.",technologies:["HTML","CSS","JavaScript"],features:[]}
  ],
  futureProjects:[
    {title:"MERN Portfolio Platform",status:"Exploring",description:"A full-stack portfolio platform with a CMS-style admin panel, authentication and database-backed content."},
    {title:"Practical Student App",status:"Planned",description:"A small full-stack application designed around a real student workflow, from requirements to deployment."},
    {title:"Cloud & Deployment",status:"Learning",description:"Learning deployment, CI/CD, containers and cloud fundamentals through a project that can live beyond localhost."}
  ]
};

async function start(){
  await mongoose.connect(process.env.MONGODB_URI);
  const adminEmail=process.env.ADMIN_EMAIL;
  const adminPassword=process.env.ADMIN_PASSWORD;
  if(adminEmail && adminPassword && !(await Admin.findOne({email:adminEmail}))){
    await Admin.create({email:adminEmail,passwordHash:await bcrypt.hash(adminPassword,12)});
    console.log("Admin account created.");
  }
  if(!(await Portfolio.findOne())) await Portfolio.create(seedPortfolio);
  const PORT=process.env.PORT||5000;
  app.listen(PORT,()=>console.log(`Portfolio server running on http://localhost:${PORT}`));
}
start().catch(err=>{console.error(err);process.exit(1)});
