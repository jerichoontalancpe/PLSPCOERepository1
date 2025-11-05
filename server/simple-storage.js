// Simple in-memory storage that will definitely work
let projects = [
  {
    id: 1,
    title: "Sample Project",
    authors: "John Doe",
    adviser: "Dr. Smith",
    year: 2024,
    abstract: "This is a sample project",
    keywords: "sample, test",
    department: "Computer Science",
    project_type: "Thesis",
    status: "completed",
    pdf_filename: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let achievements = [
  {
    id: 1,
    title: "Sample Achievement",
    description: "This is a sample achievement",
    image_filename: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let projectId = 2;
let achievementId = 2;

module.exports = {
  projects,
  achievements,
  addProject: (project) => {
    const newProject = {
      id: projectId++,
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    projects.push(newProject);
    return newProject;
  },
  addAchievement: (achievement) => {
    const newAchievement = {
      id: achievementId++,
      ...achievement,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    achievements.push(newAchievement);
    return newAchievement;
  }
};
