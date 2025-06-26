const Project = require("../models/projectModel");
const Notes = require("../models/notesModel");
const Trello = require("../models/personalTrelloModel");

exports.searchDataService = async (query, userID) => {
  const searchRegex = new RegExp(query, "i");

  const projects = await Project.find({
    $or: [{ name: searchRegex }, { "joinedMembers.userId": userID }],
    isDeleted: false,
    "joinedMembers.userId": userID,
  }).select("name joinedMembers");

  const notes = await Notes.find({ title: searchRegex, userID }).select(
    "title"
  );

  const trello = await Trello.find({ title: searchRegex, userID }).select(
    "title"
  );

  const projectSuggestions = projects.map((project) => ({
    name: project.name,
    type: "Project",
    route: `/home/project/${project.id}`,
  }));

  const noteSuggestions = notes.map((note) => ({
    name: note.title,
    type: "Note",
    route: `/home/notes`,
  }));

  const trelloSuggestions = trello.map((trelloItem) => ({
    name: trelloItem.title,
    type: "Trello",
    route: `/home/trello`,
  }));

  // Prioritize Exact Matching First
  const filterSuggestions = (data) =>
    data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

  const finalSuggestions = [
    ...filterSuggestions(noteSuggestions),
    ...filterSuggestions(trelloSuggestions),
    ...filterSuggestions(projectSuggestions),
  ];

  return finalSuggestions;
};
