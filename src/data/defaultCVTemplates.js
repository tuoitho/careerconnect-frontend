// Default CV templates for when no templates are available from the backend
export const defaultCVTemplates = [
  {
    id: 1,
    name: "Professional",
    description: "A clean, professional CV template suitable for corporate positions",
    thumbnailUrl: "https://i.imgur.com/jg9YDhF.png",
    category: "professional",
    schemaTemplate: {
      sections: {
        personal_info: {
          position: { x: 40, y: 750 },
          content: {
            name: "Your Name",
            email: "your.email@example.com",
            phone: "Your Phone Number",
            location: "Your Location",
            linkedin: "linkedin.com/in/yourprofile"
          },
          style: {
            fontFamily: "Arial",
            fontSize: "14px",
            color: "#333333"
          }
        },
        summary: {
          title: "Professional Summary",
          position: { x: 40, y: 650 },
          content: "Experienced professional with a proven track record of success. Skilled in leadership, communication, and problem-solving. Looking to leverage my skills and experience in a challenging new role.",
          style: {
            fontFamily: "Arial",
            fontSize: "12px",
            color: "#555555"
          }
        },
        experience: {
          title: "Work Experience",
          position: { x: 40, y: 550 },
          content: {
            job1: {
              title: "Senior Position",
              company: "Company Name",
              duration: "2020 - Present",
              description: "Led a team of professionals in delivering exceptional results. Increased efficiency by 25% and reduced costs by 15%."
            },
            job2: {
              title: "Mid-level Position",
              company: "Previous Company",
              duration: "2016 - 2020",
              description: "Managed key projects and client relationships. Recognized for outstanding performance."
            }
          },
          style: {
            fontFamily: "Arial",
            fontSize: "12px",
            color: "#555555"
          }
        },
        education: {
          title: "Education",
          position: { x: 40, y: 350 },
          content: {
            degree1: {
              degree: "Bachelor's Degree",
              university: "University Name",
              year: "2012 - 2016",
              gpa: "3.8/4.0"
            }
          },
          style: {
            fontFamily: "Arial",
            fontSize: "12px",
            color: "#555555"
          }
        },
        skills: {
          title: "Skills",
          position: { x: 40, y: 250 },
          content: {
            skill1: "Leadership",
            skill2: "Communication",
            skill3: "Problem Solving",
            skill4: "Project Management",
            skill5: "Team Building"
          },
          style: {
            fontFamily: "Arial",
            fontSize: "12px",
            color: "#555555"
          }
        }
      },
      metadata: {
        templateName: "Professional",
        version: 1.0
      }
    }
  },
  {
    id: 2,
    name: "Creative",
    description: "A modern, creative CV template for design and creative positions",
    thumbnailUrl: "https://i.imgur.com/DTPQV1v.png",
    category: "creative",
    schemaTemplate: {
      sections: {
        personal_info: {
          position: { x: 40, y: 750 },
          content: {
            name: "Your Name",
            email: "your.email@example.com",
            phone: "Your Phone Number",
            location: "Your Location",
            portfolio: "yourportfolio.com"
          },
          style: {
            fontFamily: "Helvetica",
            fontSize: "16px",
            color: "#222222"
          }
        },
        about_me: {
          title: "About Me",
          position: { x: 40, y: 650 },
          content: "Creative professional with a passion for design and innovation. Combining technical skills with artistic vision to create compelling work that communicates effectively.",
          style: {
            fontFamily: "Helvetica",
            fontSize: "13px",
            color: "#444444"
          }
        },
        experience: {
          title: "Experience",
          position: { x: 40, y: 550 },
          content: {
            job1: {
              title: "Senior Designer",
              company: "Design Studio",
              duration: "2019 - Present",
              description: "Led creative direction for major client projects. Created award-winning designs that increased client engagement by 40%."
            },
            job2: {
              title: "Junior Designer",
              company: "Creative Agency",
              duration: "2017 - 2019",
              description: "Collaborated with team members to develop visual concepts and designs for various platforms."
            }
          },
          style: {
            fontFamily: "Helvetica",
            fontSize: "13px",
            color: "#444444"
          }
        },
        skills: {
          title: "Skills & Tools",
          position: { x: 40, y: 350 },
          content: {
            skill1: "Adobe Creative Suite",
            skill2: "UI/UX Design",
            skill3: "Typography",
            skill4: "Branding",
            skill5: "Illustration"
          },
          style: {
            fontFamily: "Helvetica",
            fontSize: "13px",
            color: "#444444"
          }
        },
        education: {
          title: "Education",
          position: { x: 40, y: 250 },
          content: {
            degree1: {
              degree: "BFA in Graphic Design",
              university: "Art Institute",
              year: "2013 - 2017"
            }
          },
          style: {
            fontFamily: "Helvetica",
            fontSize: "13px",
            color: "#444444"
          }
        }
      },
      metadata: {
        templateName: "Creative",
        version: 1.0
      }
    }
  },
  {
    id: 3,
    name: "Simple",
    description: "A straightforward, no-frills CV template focusing on content clarity",
    thumbnailUrl: "https://i.imgur.com/9kYmQAQ.png",
    category: "simple",
    schemaTemplate: {
      sections: {
        personal_info: {
          position: { x: 40, y: 750 },
          content: {
            name: "Your Name",
            email: "your.email@example.com",
            phone: "Your Phone Number",
            location: "Your Location"
          },
          style: {
            fontFamily: "Times New Roman",
            fontSize: "14px",
            color: "#000000"
          }
        },
        objective: {
          title: "Career Objective",
          position: { x: 40, y: 680 },
          content: "To secure a position where I can efficiently contribute my skills and abilities to the growth of the organization and build my professional career.",
          style: {
            fontFamily: "Times New Roman",
            fontSize: "12px",
            color: "#000000"
          }
        },
        experience: {
          title: "Work Experience",
          position: { x: 40, y: 600 },
          content: {
            job1: {
              title: "Position Title",
              company: "Company Name",
              duration: "Start Date - End Date",
              description: "Description of responsibilities and achievements."
            },
            job2: {
              title: "Previous Position",
              company: "Previous Company",
              duration: "Start Date - End Date",
              description: "Description of responsibilities and achievements."
            }
          },
          style: {
            fontFamily: "Times New Roman",
            fontSize: "12px",
            color: "#000000"
          }
        },
        education: {
          title: "Education",
          position: { x: 40, y: 400 },
          content: {
            degree1: {
              degree: "Degree Name",
              university: "Institution Name",
              year: "Graduation Year"
            }
          },
          style: {
            fontFamily: "Times New Roman",
            fontSize: "12px",
            color: "#000000"
          }
        },
        skills: {
          title: "Skills",
          position: { x: 40, y: 300 },
          content: {
            skill1: "Skill 1",
            skill2: "Skill 2",
            skill3: "Skill 3",
            skill4: "Skill 4"
          },
          style: {
            fontFamily: "Times New Roman",
            fontSize: "12px",
            color: "#000000"
          }
        },
        references: {
          title: "References",
          position: { x: 40, y: 200 },
          content: "Available upon request",
          style: {
            fontFamily: "Times New Roman",
            fontSize: "12px",
            color: "#000000"
          }
        }
      },
      metadata: {
        templateName: "Simple",
        version: 1.0
      }
    }
  }
];

export default defaultCVTemplates;