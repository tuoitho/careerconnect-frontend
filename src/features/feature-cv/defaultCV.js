// Default CV structure to use when creating a new CV
export const defaultCV = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: ""
  },
  experiences: [],
  education: [],
  skills: []
};

// Example CV with sample data
export const exampleCV = {
  personalInfo: {
    fullName: "John Doe",
    title: "Full Stack Developer",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "johndoe.dev",
    summary: "Passionate full stack developer with 5+ years of experience building web applications with React, Node.js, and modern JavaScript. Committed to writing clean, maintainable code and creating intuitive user experiences."
  },
  experiences: [
    {
      id: "exp1",
      title: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "01/2020",
      endDate: "",
      current: true,
      description: "• Lead a team of 5 frontend developers\n• Implemented modern React architecture with TypeScript\n• Reduced bundle size by 40% and improved load times by 35%\n• Collaborated with UX/UI designers to create responsive interfaces"
    },
    {
      id: "exp2",
      title: "Full Stack Developer",
      company: "Digital Innovations",
      location: "San Jose, CA",
      startDate: "03/2017",
      endDate: "12/2019",
      current: false,
      description: "• Developed RESTful APIs using Node.js and Express\n• Built responsive web applications with React and Redux\n• Implemented continuous integration and deployment pipelines\n• Optimized database queries and improved application performance"
    }
  ],
  education: [
    {
      id: "edu1",
      degree: "Master of Science in Computer Science",
      institution: "University of California",
      location: "Berkeley, CA",
      startDate: "08/2015",
      endDate: "05/2017",
      current: false,
      description: "Focus on Software Engineering and AI. Relevant coursework: Advanced Algorithms, Machine Learning, Database Systems, Web Development."
    },
    {
      id: "edu2",
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      startDate: "08/2011",
      endDate: "05/2015",
      current: false,
      description: "Minor in Mathematics. Dean's List for 6 semesters."
    }
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "GraphQL",
    "Docker",
    "AWS",
    "Git",
    "CI/CD",
    "Jest",
    "Webpack"
  ]
};