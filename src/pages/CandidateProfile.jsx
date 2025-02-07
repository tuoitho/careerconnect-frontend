import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiSave,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { candidateService } from "../services/candidateService";
import { useEffect } from "react";

function CandidateProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    userId: 1,
    fullname: "John Doe",
    avatar: "https://placehold.co/111",
    phone: "0123456789",
    email: "john.doe@example.com",
    bio: "Experienced software developer with a passion for creating innovative solutions.",
    skills: ["React", "JavaScript", "Node.js", "Java"],
    educations: [
      {
        educationId: 1,
        school: "University of Technology",
        major: "Computer Science",
        degree: "Bachelor",
        startDate: "2018-09",
        endDate: "2022-06",
        description: "Focused on software engineering and web development",
        gpa: "3.8",
        type: "University",
      },
    ],
    experiences: [
      {
        experienceId: 1,
        companyName: "Tech Corp",
        position: "Software Engineer",
        startDate: "2022-07",
        endDate: "Present",
        description: "Developing web applications using React and Node.js",
      },
    ],
    cvs: [
      {
        cvId: 1,
        name: "Software Developer CV",
        path: "/path/to/cv.pdf",
        active: true,
      },
    ],
  });

  const [newSkill, setNewSkill] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newCVName, setNewCVName] = useState("");
  const [newCVFile, setNewCVFile] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await candidateService.getCandidatrProfile();
        setProfile(data.result);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setApiError("Failed to load profile. Please try again later."); // Set error message
      } finally {
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append(
        "profile",
        JSON.stringify({
          fullname: profile.fullname,
          phone: profile.phone,
          email: profile.email,
          bio: profile.bio,
          skills: profile.skills,
          educations: profile.educations,
          experiences: profile.experiences,
          cvs: profile.cvs,
        })
      );

      // Append avatar if a file is selected
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const response = await candidateService.updateCandidatProfile(formData);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsEditing(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCVFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewCVFile(e.target.files[0]);
    }
  };

  const handleUploadCV = async () => {
    try {
      if (!newCVName.trim() || !newCVFile) {
        toast.info("Please enter a CV title and select a file.");
        return;
      }
      const formData = new FormData();
      formData.append("file", newCVFile);
      formData.append("cvName", newCVName);

      const response = await candidateService.uploadCV(formData);
      toast.success(response.message);
      //reload
      setProfile((prev) => ({
        ...prev,
        cvs: [...prev.cvs, response.result],
      }));

      setNewCVName("");
      setNewCVFile(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addEducation = () => {
    const newEducation = {
      school: "",
      major: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
      gpa: "",
      type: "",
    };
    setProfile((prev) => ({
      ...prev,
      educations: [...prev.educations, newEducation],
    }));
  };

  const updateEducation = (id, field, value) => {
    setProfile((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) =>
        edu.educationId === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id) => {
    setProfile((prev) => ({
      ...prev,
      educations: prev.educations.filter((edu) => edu.educationId !== id),
    }));
  };

  const addExperience = () => {
    const newExperience = {
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setProfile((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
  };

  const updateExperience = (id, field, value) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.experienceId === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.experienceId !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {isEditing ? (
              <>
                <FiSave className="h-5 w-5" />
                Save Changes
              </>
            ) : (
              <>
                <FiEdit2 className="h-5 w-5" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <img
                src={preview || profile.avatar}
                alt={profile.fullname}
                className="h-24 w-24 rounded-full object-cover"
              />
              {isEditing && (
                <label className="mt-2 text-sm text-primary-600 hover:text-primary-700 cursor-pointer">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            <div className="flex-1 grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullname}
                  onChange={(e) =>
                    setProfile({ ...profile, fullname: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                {skill}
                {isEditing && (
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </span>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            {isEditing && (
              <button
                onClick={addEducation}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <FiPlus className="h-5 w-5" />
                Add Education
              </button>
            )}
          </div>
          <div className="space-y-6">
            {profile.educations.map((education) => (
              <div
                key={education.educationId}
                className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      School
                    </label>
                    <input
                      type="text"
                      value={education.school}
                      onChange={(e) =>
                        updateEducation(
                          education.educationId,
                          "school",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Major
                    </label>
                    <input
                      type="text"
                      value={education.major}
                      onChange={(e) =>
                        updateEducation(
                          education.educationId,
                          "major",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(e) =>
                        updateEducation(
                          education.educationId,
                          "degree",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      GPA
                    </label>
                    <input
                      type="text"
                      value={education.gpa}
                      onChange={(e) =>
                        updateEducation(
                          education.educationId,
                          "gpa",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={education.startDate}
                      onChange={(e) =>
                        updateEducation(
                          education.educationId,
                          "startDate",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={education.endDate}
                      onChange={(e) =>
                        updateEducation(
                          education.educationId,
                          "endDate",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={education.description}
                    onChange={(e) =>
                      updateEducation(
                        education.educationId,
                        "description",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeEducation(education.educationId)}
                    className="mt-4 text-red-600 hover:text-red-700 flex items-center gap-2"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
            {isEditing && (
              <button
                onClick={addExperience}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <FiPlus className="h-5 w-5" />
                Add Experience
              </button>
            )}
          </div>
          <div className="space-y-6">
            {profile.experiences.map((experience) => (
              <div
                key={experience.experienceId}
                className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={experience.companyName}
                      onChange={(e) =>
                        updateExperience(
                          experience.experienceId,
                          "companyName",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <input
                      type="text"
                      value={experience.position}
                      onChange={(e) =>
                        updateExperience(
                          experience.experienceId,
                          "position",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) =>
                        updateExperience(
                          experience.experienceId,
                          "startDate",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) =>
                        updateExperience(
                          experience.experienceId,
                          "endDate",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={experience.description}
                    onChange={(e) =>
                      updateExperience(
                        experience.experienceId,
                        "description",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeExperience(experience.experienceId)}
                    className="mt-4 text-red-600 hover:text-red-700 flex items-center gap-2"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CVs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CVs</h2>
          <div className="space-y-4">
            {profile.cvs.map((cv) => (
              <div
                key={cv.cvId}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{cv.name}</h3>
                  <p className="text-sm text-gray-500">{cv.path}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {cv.active && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  )}
                  {isEditing && (
                    <button className="text-red-600 hover:text-red-700">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isEditing && (
              <>
          
                <div className="mt-2 flex flex-col space-y-2">
                  <input
                    type="text"
                    placeholder="Enter CV Title"
                    value={newCVName}
                    onChange={(e) => setNewCVName(e.target.value)}
                    className="rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleCVFileChange}
                    className="rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleUploadCV}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Upload
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfile;
