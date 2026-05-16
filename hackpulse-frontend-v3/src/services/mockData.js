export const mockStats = {
  totalParticipants: 248, activeTeams: 52, totalSubmissions: 41, averageScore: 74.3,
};

export const mockLeaderboard = [
  { rank:1,  teamName:"Neural Ninjas",  projectTitle:"MediScan AI",    score:96.5, members:4, techStack:["React","Python","TensorFlow"], status:"Evaluated"    },
  { rank:2,  teamName:"ByteForge",      projectTitle:"EcoTrack",        score:93.2, members:3, techStack:["Vue","Node.js","MongoDB"],     status:"Evaluated"    },
  { rank:3,  teamName:"Quantum Leap",   projectTitle:"FinFlow",         score:91.8, members:5, techStack:["Angular","Spring Boot","MySQL"],status:"Evaluated"    },
  { rank:4,  teamName:"CodeCraft",      projectTitle:"SmartCampus",     score:88.4, members:4, techStack:["React","FastAPI","PostgreSQL"], status:"Evaluated"    },
  { rank:5,  teamName:"DevDragons",     projectTitle:"GreenGrid",       score:85.9, members:3, techStack:["Next.js","Prisma","Redis"],     status:"Evaluated"    },
  { rank:6,  teamName:"PixelPirates",   projectTitle:"Voicify",         score:83.1, members:4, techStack:["React Native","Node.js"],      status:"Evaluated"    },
  { rank:7,  teamName:"AlgoAce",        projectTitle:"StudySync",       score:80.6, members:2, techStack:["Svelte","Supabase"],            status:"Under Review" },
  { rank:8,  teamName:"CloudRiders",    projectTitle:"SafeRoute",       score:78.3, members:5, techStack:["Flutter","Django","AWS"],       status:"Under Review" },
  { rank:9,  teamName:"StarterKit",     projectTitle:"BudgetBuddy",     score:75.0, members:3, techStack:["React","Express","MySQL"],      status:"Evaluated"    },
  { rank:10, teamName:"HexDevs",        projectTitle:"PetCare+",        score:71.4, members:4, techStack:["React","Nest.js","PostgreSQL"], status:"Under Review" },
];

export const mockTeams = [
  {
    id:1, rank:1, teamName:"Neural Ninjas", projectTitle:"MediScan AI", score:96.5,
    description:"AI-powered medical image analysis platform that detects anomalies in X-rays with 97% accuracy using deep learning.",
    techStack:["React","Python","TensorFlow","FastAPI","PostgreSQL"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Evaluated", remarks:"Exceptional model accuracy and production-ready UI.",
    members:[
      {name:"Arjun Sharma",  role:"Team Lead",   avatar:"AS"},
      {name:"Priya Mehta",   role:"ML Engineer", avatar:"PM"},
      {name:"Rohan Das",     role:"Backend Dev", avatar:"RD"},
      {name:"Sneha Kulkarni",role:"UI/UX",       avatar:"SK"},
    ],
  },
  {
    id:2, rank:2, teamName:"ByteForge", projectTitle:"EcoTrack", score:93.2,
    description:"Real-time carbon footprint tracker for organizations with automated ESG reporting and sustainability insights.",
    techStack:["Vue.js","Node.js","MongoDB","Chart.js","AWS S3"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Evaluated", remarks:"Great visualizations, needs better mobile responsiveness.",
    members:[
      {name:"Aditya Singh",role:"Team Lead",   avatar:"AD"},
      {name:"Kavya Nair",  role:"Full Stack",  avatar:"KN"},
      {name:"Vivek Patel", role:"Data Analyst",avatar:"VP"},
    ],
  },
  {
    id:3, rank:3, teamName:"Quantum Leap", projectTitle:"FinFlow", score:91.8,
    description:"Intelligent cash flow prediction system for SMBs using ML-based forecasting and automated invoicing.",
    techStack:["Angular","Spring Boot","MySQL","Docker","Kubernetes"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Evaluated", remarks:"Enterprise-ready solution with excellent DevOps setup.",
    members:[
      {name:"Rahul Gupta",    role:"Team Lead",avatar:"RG"},
      {name:"Ananya Roy",     role:"Frontend", avatar:"AR"},
      {name:"Siddharth Joshi",role:"Backend",  avatar:"SJ"},
      {name:"Deepika Rao",    role:"QA",       avatar:"DR"},
      {name:"Karan Verma",    role:"DevOps",   avatar:"KV"},
    ],
  },
];

export const allMockTeams = [
  ...mockTeams,
  {
    id:4, rank:4, teamName:"CodeCraft", projectTitle:"SmartCampus", score:88.4,
    description:"IoT-based smart campus system for real-time resource monitoring and energy optimization.",
    techStack:["React","FastAPI","PostgreSQL","MQTT","Arduino"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Evaluated", remarks:"Practical IoT integration. Minor UX issues.",
    members:[
      {name:"Dev Anand",  role:"Team Lead",  avatar:"DA"},
      {name:"Riya Bose",  role:"Backend",    avatar:"RB"},
      {name:"Suraj Nair", role:"Frontend",   avatar:"SN"},
      {name:"Mita Joshi", role:"QA",         avatar:"MJ"},
    ],
  },
  {
    id:5, rank:5, teamName:"DevDragons", projectTitle:"GreenGrid", score:85.9,
    description:"Renewable energy grid optimizer using predictive analytics and real-time demand forecasting.",
    techStack:["Next.js","Prisma","Redis","Python","TensorFlow"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Evaluated", remarks:"Innovative renewable energy approach.",
    members:[
      {name:"Lakshmi R",  role:"Team Lead",  avatar:"LR"},
      {name:"Kiran M",    role:"ML Engineer",avatar:"KM"},
      {name:"Harish P",   role:"DevOps",     avatar:"HP"},
    ],
  },
  {
    id:6, rank:6, teamName:"PixelPirates", projectTitle:"Voicify", score:83.1,
    description:"NLP-powered voice assistant for accessibility in education for differently-abled students.",
    techStack:["React Native","Node.js","Firebase","NLP","TensorFlow Lite"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Evaluated", remarks:"Creative NLP application. Needs offline mode.",
    members:[
      {name:"Arun K",   role:"Team Lead",  avatar:"AK"},
      {name:"Meena S",  role:"Mobile Dev", avatar:"MS"},
      {name:"Raj V",    role:"NLP Eng",    avatar:"RV"},
      {name:"Preet D",  role:"UX Design",  avatar:"PD"},
    ],
  },
  {
    id:7, rank:7, teamName:"AlgoAce", projectTitle:"StudySync", score:80.6,
    description:"AI-driven study planner that adapts to student learning patterns using spaced repetition.",
    techStack:["Svelte","Supabase","Edge Functions","OpenAI API"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Under Review", remarks:"",
    members:[
      {name:"Vikram S", role:"Team Lead",  avatar:"VS"},
      {name:"Pooja R",  role:"AI Engineer",avatar:"PR"},
    ],
  },
  {
    id:8, rank:8, teamName:"CloudRiders", projectTitle:"SafeRoute", score:78.3,
    description:"Real-time safe route planner using crowd-sourced safety data and ML-based threat detection.",
    techStack:["Flutter","Django","AWS","Google Maps API","ML Kit"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Under Review", remarks:"",
    members:[
      {name:"Nisha M",   role:"Team Lead",  avatar:"NM"},
      {name:"Rohan K",   role:"Backend",    avatar:"RK"},
      {name:"Diya P",    role:"Mobile",     avatar:"DP"},
      {name:"Aarav S",   role:"Data Sci",   avatar:"AS"},
      {name:"Tanya B",   role:"DevOps",     avatar:"TB"},
    ],
  },
  {
    id:9, rank:9, teamName:"StarterKit", projectTitle:"BudgetBuddy", score:75.0,
    description:"Personal finance tracker with smart expense categorization and savings goal automation.",
    techStack:["React","Express","MySQL","Chart.js","Plaid API"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Evaluated", remarks:"Clean UI and practical features. Needs bank integration.",
    members:[
      {name:"Aman G",   role:"Team Lead",  avatar:"AG"},
      {name:"Sneha T",  role:"Backend",    avatar:"ST"},
      {name:"Rahul B",  role:"Frontend",   avatar:"RB"},
    ],
  },
  {
    id:10, rank:10, teamName:"HexDevs", projectTitle:"PetCare+", score:71.4,
    description:"Smart pet health monitoring app with vet appointment scheduling and symptom checker.",
    techStack:["React","Nest.js","PostgreSQL","Stripe","Twilio"],
    githubUrl:"https://github.com", demoUrl:"https://demo.io",
    submissionStatus:"Under Review", remarks:"",
    members:[
      {name:"Divya N",  role:"Team Lead",  avatar:"DN"},
      {name:"Arjit S",  role:"Backend",    avatar:"AS"},
      {name:"Kaveri R", role:"Frontend",   avatar:"KR"},
      {name:"Manas P",  role:"Design",     avatar:"MP"},
    ],
  },
];

export const mockSubmissions = [
  { id:1, teamName:"Neural Ninjas",  projectTitle:"MediScan AI",  submittedAt:"2025-03-15 14:32", status:"Evaluated",    score:96.5, judge:"Dr. Anjali Verma", remarks:"Outstanding execution and clinical relevance."   },
  { id:2, teamName:"ByteForge",      projectTitle:"EcoTrack",      submittedAt:"2025-03-15 16:10", status:"Evaluated",    score:93.2, judge:"Prof. Ravi Kumar",  remarks:"Great visualizations."                           },
  { id:3, teamName:"Quantum Leap",   projectTitle:"FinFlow",       submittedAt:"2025-03-16 09:45", status:"Evaluated",    score:91.8, judge:"Dr. Anjali Verma", remarks:"Enterprise-ready solution."                       },
  { id:4, teamName:"CodeCraft",      projectTitle:"SmartCampus",   submittedAt:"2025-03-16 11:20", status:"Evaluated",    score:88.4, judge:"Mr. Suresh Iyer",  remarks:"Practical IoT integration."                       },
  { id:5, teamName:"DevDragons",     projectTitle:"GreenGrid",     submittedAt:"2025-03-16 13:55", status:"Evaluated",    score:85.9, judge:"Prof. Ravi Kumar",  remarks:"Innovative renewable energy approach."            },
  { id:6, teamName:"AlgoAce",        projectTitle:"StudySync",     submittedAt:"2025-03-17 10:30", status:"Under Review", score:null, judge:"Dr. Anjali Verma", remarks:""                                                 },
  { id:7, teamName:"CloudRiders",    projectTitle:"SafeRoute",     submittedAt:"2025-03-17 12:00", status:"Under Review", score:null, judge:"Dr. Anjali Verma", remarks:""                                                 },
  { id:8, teamName:"PixelPirates",   projectTitle:"Voicify",       submittedAt:"2025-03-17 14:45", status:"Evaluated",    score:83.1, judge:"Mr. Suresh Iyer",  remarks:"Creative NLP application."                        },
  { id:9, teamName:"StarterKit",     projectTitle:"BudgetBuddy",   submittedAt:"2025-03-17 16:20", status:"Evaluated",    score:75.0, judge:"Prof. Ravi Kumar",  remarks:"Clean UI and practical features."                 },
  { id:10,teamName:"HexDevs",        projectTitle:"PetCare+",      submittedAt:"2025-03-18 09:10", status:"Under Review", score:null, judge:"Dr. Anjali Verma", remarks:""                                                 },
];

export const mockScoreChart         = [{name:"Round 1",avg:68},{name:"Round 2",avg:72},{name:"Round 3",avg:76},{name:"Final",avg:74.3}];
export const mockSubmissionTimeline = [{day:"Mon",submissions:4},{day:"Tue",submissions:7},{day:"Wed",submissions:12},{day:"Thu",submissions:9},{day:"Fri",submissions:6},{day:"Sat",submissions:3}];
export const mockTechDistribution   = [{name:"React",value:38},{name:"Node.js",value:24},{name:"Python",value:20},{name:"Flutter",value:10},{name:"Other",value:8}];

export const myTeamData = {
  id:1, teamName:"Neural Ninjas", projectTitle:"MediScan AI", score:96.5, rank:1,
  description:"AI-powered medical image analysis platform detecting anomalies in X-rays with 97% accuracy.",
  techStack:["React","Python","TensorFlow","FastAPI","PostgreSQL"],
  githubUrl:"https://github.com", demoUrl:"https://demo.io",
  submissionStatus:"Evaluated", remarks:"Exceptional model accuracy and production-ready UI.",
  members:[
    {name:"Arjun Sharma",  role:"Team Lead",   avatar:"AS"},
    {name:"Priya Mehta",   role:"ML Engineer", avatar:"PM"},
    {name:"Rohan Das",     role:"Backend Dev", avatar:"RD"},
    {name:"Sneha Kulkarni",role:"UI/UX",       avatar:"SK"},
  ],
};
