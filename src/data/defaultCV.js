// Default CV structure with sample data
export const defaultCV = {
  personalInfo: {
    fullName: "Nguyễn Văn A",
    title: "Senior Software Engineer",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    address: "Hà Nội, Việt Nam",
    summary: "Kỹ sư phần mềm với hơn 5 năm kinh nghiệm trong phát triển ứng dụng web. Chuyên môn về JavaScript, React và Node.js. Đã dẫn dắt nhiều dự án thành công và mentor cho các thành viên junior trong team."
  },
  education: [
    {
      school: "Đại học Bách Khoa Hà Nội",
      degree: "Kỹ sư Công nghệ Thông tin",
      startDate: "2015-09-01",
      endDate: "2019-06-30"
    },
    {
      school: "Đại học FPT",
      degree: "Chứng chỉ AWS Solutions Architect",
      startDate: "2020-01-01",
      endDate: "2020-06-30"
    }
  ],
  experience: [
    {
      company: "Tech Solutions JSC",
      position: "Senior Software Engineer",
      startDate: "2021-01-01",
      endDate: "2023-12-31",
      description: "Phát triển và duy trì các ứng dụng web enterprise sử dụng React và Node.js. Tối ưu hiệu suất ứng dụng, giảm 40% thời gian tải trang. Mentor cho 3 developer junior."
    },
    {
      company: "Digital Innovation Corp",
      position: "Software Engineer",
      startDate: "2019-07-01",
      endDate: "2020-12-31",
      description: "Phát triển frontend cho các ứng dụng web responsive. Triển khai CI/CD pipeline và cải thiện quy trình phát triển phần mềm."
    }
  ],
  skills: [
    {
      name: "JavaScript/TypeScript",
      level: "Expert"
    },
    {
      name: "React.js",
      level: "Expert"
    },
    {
      name: "Node.js",
      level: "Advanced"
    },
    {
      name: "AWS",
      level: "Intermediate"
    },
    {
      name: "Docker",
      level: "Intermediate"
    }
  ]
};