const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const AlumniProfile = require("../models/AlumniProfile");
const FacultyProfile = require("../models/FacultyProfile");
const Job = require("../models/Job");
const Internship = require("../models/Internship");
const Mentorship = require("../models/Mentorship");
const Application = require("../models/Application");
const Event = require("../models/Event");
const Announcement = require("../models/Announcement");

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("ℹ️ MongoDB already contains data. Skipping initial seeding.");
      return;
    }

    console.log("🌱 Seeding MongoDB with initial platform data...");

    // 1. Create Users
    const studentUser = await User.create({
      name: "Rohan Varma",
      email: "rohan.v@student.edu",
      password: "student123",
      role: "Student",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
    });

    const alumniUser1 = await User.create({
      name: "Arun Kumar",
      email: "arun.kumar@tcs.example.com",
      password: "alumni123",
      role: "Alumni",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    });

    const alumniUser2 = await User.create({
      name: "Priya Sharma",
      email: "priya.sharma@zoho.example.com",
      password: "alumni123",
      role: "Alumni",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    });

    const facultyUser = await User.create({
      name: "Dr. S. Meenakshi",
      email: "meenakshi.s@college.edu",
      password: "faculty123",
      role: "Faculty",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    });

    const adminUser = await User.create({
      name: "College Administrator",
      email: "admin@college.edu",
      password: "admin123",
      role: "Admin",
      isVerified: true,
    });

    // 2. Create Profiles
    await StudentProfile.create({
      user: studentUser._id,
      department: "Computer Science & Engineering",
      batch: "2023-2027",
      rollNumber: "23CS104",
      cgpa: "8.8",
      skills: ["Java", "Spring Boot", "React", "SQL", "Git"],
      interests: ["Full Stack Development", "Cloud Architecture"],
      bio: "Pre-final year CSE student passionate about distributed systems and cloud applications.",
      github: "https://github.com/rohanvarma",
      linkedin: "https://linkedin.com/in/rohanvarma",
    });

    await AlumniProfile.create({
      user: alumniUser1._id,
      company: "Tata Consultancy Services (TCS)",
      jobTitle: "Senior Software Engineer",
      industry: "Information Technology",
      graduationYear: "2022",
      department: "Computer Science and Engineering",
      location: "Chennai, India",
      expertise: ["Java", "Spring Boot", "React", "System Design"],
      bio: "Passionate engineer with 4+ years of industry experience. Happy to mentor juniors on full-stack architecture and placement preparation.",
      isMentoring: true,
      mentorshipTopics: ["Full Stack Web Dev", "Mock Interviews", "Resume Review"],
      linkedin: "https://linkedin.com/in/arun-kumar",
    });

    await AlumniProfile.create({
      user: alumniUser2._id,
      company: "Zoho Corporation",
      jobTitle: "Lead Data Analyst",
      industry: "SaaS / Analytics",
      graduationYear: "2021",
      department: "Information Technology",
      location: "Bengaluru, India",
      expertise: ["Python", "SQL", "Power BI", "Data Analytics"],
      bio: "Specializing in business intelligence and data pipelines. Looking forward to guiding enthusiastic students interested in Data Science careers.",
      isMentoring: true,
      mentorshipTopics: ["Data Analytics", "SQL Mastery", "Career Transition"],
      linkedin: "https://linkedin.com/in/priya-sharma",
    });

    await FacultyProfile.create({
      user: facultyUser._id,
      department: "Computer Science and Engineering",
      designation: "Associate Professor & Alumni Coordinator",
      employeeId: "FAC2018CSE04",
      researchAreas: ["Cloud Computing", "Distributed Systems", "Software Engineering"],
      officeHours: "Mon-Thu: 02:00 PM - 04:00 PM",
      bio: "Faculty member with 12+ years of teaching and research experience. Passionate about student mentorship.",
    });

    // 3. Create Jobs
    const job1 = await Job.create({
      title: "Junior Software Engineer",
      company: "Tata Consultancy Services (TCS)",
      location: "Chennai / Hybrid",
      jobType: "Full-time",
      experienceLevel: "0-2 Years",
      salary: "₹6.5 - ₹8.5 LPA",
      description: "Looking for enthusiastic software engineers proficient in Java, Spring Boot and modern JavaScript. Great mentoring and career progression.",
      requirements: "B.E / B.Tech in CSE, IT or related fields\nGood foundation in Data Structures and Algorithms\nFamiliarity with REST APIs and Git",
      skills: ["Java", "Spring Boot", "React", "SQL"],
      postedBy: alumniUser1._id,
      applicantsCount: 1,
    });

    const job2 = await Job.create({
      title: "Associate Product Analyst",
      company: "Zoho Corporation",
      location: "Chennai / On-site",
      jobType: "Full-time",
      experienceLevel: "0-1 Year",
      salary: "₹5.5 - ₹7.5 LPA",
      description: "Analyze user workflows, write product specifications, and coordinate between engineering and design teams for SaaS solutions.",
      requirements: "Strong analytical thinking and problem-solving skills\nProficiency with Excel and SQL\nExcellent communication",
      skills: ["Product Analysis", "SQL", "Agile"],
      postedBy: alumniUser2._id,
      applicantsCount: 0,
    });

    // 4. Create Internships
    const internship1 = await Internship.create({
      title: "Frontend React Developer Intern",
      company: "TechNova Solutions",
      location: "Remote",
      duration: "3 Months",
      stipend: "₹15,000 / Month",
      internshipType: "Virtual",
      description: "Work with engineering teams building responsive React interfaces and consuming REST APIs.",
      requirements: "Knowledge of HTML5, CSS3, JavaScript (ES6+), React\nExperience with Git version control",
      skills: ["React", "JavaScript", "HTML5", "CSS3", "Git"],
      postedBy: alumniUser1._id,
      applicantsCount: 1,
    });

    // 5. Create Applications
    await Application.create({
      applicant: studentUser._id,
      itemType: "job",
      itemId: job1._id,
      itemModel: "Job",
      resumeUrl: "https://drive.google.com/sample-resume",
      coverNote: "Passionate about backend microservices and clean code. Ready for immediate joining.",
      status: "under_review",
    });

    await Application.create({
      applicant: studentUser._id,
      itemType: "internship",
      itemId: internship1._id,
      itemModel: "Internship",
      resumeUrl: "https://drive.google.com/sample-resume-2",
      coverNote: "Built 3 live production web projects in React.",
      status: "shortlisted",
    });

    // 6. Create Mentorship Requests
    await Mentorship.create({
      student: studentUser._id,
      mentor: alumniUser1._id,
      topic: "Full Stack Career Roadmap & Mock Interview",
      message: "Hi Arun, I am a 3rd year CSE student preparing for product placements. Would love your feedback on my portfolio!",
      status: "accepted",
      responseMessage: "Glad to help! Let's connect this Saturday at 4 PM.",
      meetingLink: "https://meet.google.com/abc-defg-hij",
    });

    await Mentorship.create({
      student: studentUser._id,
      mentor: alumniUser2._id,
      topic: "Transitioning into Data Analytics",
      message: "Hello Priya, I am learning SQL and Power BI and want guidance on real-world projects.",
      status: "pending",
    });

    // 7. Create Events
    await Event.create({
      title: "Masterclass: Cloud Architecture & DevOps in Enterprise",
      description: "Comprehensive weekend workshop on designing microservices, Docker containerization, and AWS infrastructure.",
      category: "Workshop",
      date: "2026-09-12",
      time: "10:00 AM - 01:00 PM IST",
      location: "Auditorium / Online",
      mode: "online",
      meetingLink: "https://meet.google.com/cloud-masterclass-2026",
      speaker: "Rahul Raj",
      speakerRole: "Cloud Architect at Infosys (2020 Batch)",
      organizer: facultyUser._id,
    });

    await Event.create({
      title: "Annual Alumni Homecoming & Networking Mixer 2026",
      description: "Celebrate the achievements of our graduates with networking dinner, interactive panel talks, and student awards.",
      category: "Reunion",
      date: "2026-10-05",
      time: "05:00 PM - 08:30 PM IST",
      location: "Campus Main Hall",
      mode: "offline",
      speaker: "College Alumni Association",
      speakerRole: "Distinguished Alumni Panel",
      organizer: facultyUser._id,
    });

    // 8. Create Announcements
    await Announcement.create({
      title: "Placement Training Workshop: Cloud Architecture & DevOps",
      content: "All 3rd and 4th-year students are requested to register for the upcoming weekend workshop led by alumni from Infosys and Google.",
      targetRole: "all",
      author: facultyUser._id,
    });

    await Announcement.create({
      title: "Annual Alumni Homecoming 2026 Registration Open",
      content: "Department invites all batch alumni to attend our annual homecoming and interactive networking mixer.",
      targetRole: "all",
      author: facultyUser._id,
    });

    console.log("✅ MongoDB seeding completed successfully!");
  } catch (error) {
    console.error("⚠️ Seeding error:", error.message);
  }
};

module.exports = seedDatabase;
