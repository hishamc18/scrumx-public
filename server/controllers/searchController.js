const { searchDataService } = require("../services/searchService");
const asyncHandler = require("../utils/asyncHandler");

exports.searchAllController = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const userID = req.user.id;

  console.log(userID, "usss");
  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  const result = await searchDataService(query, userID);

  res.status(200).json(result);
});
