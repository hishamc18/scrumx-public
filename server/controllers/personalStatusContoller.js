const asyncHandler = require("../utils/asyncHandler");
const { fetchStatusService,addStatusServices,changeStatusServeices,deleteStatusServices} = require("../services/personalStatus");

//get status
exports.fetchStatus = asyncHandler(async (req, res) => {
    const userID = req.user.id;   
    const statuses = await fetchStatusService(userID);
    res.status(200).json({ success: true, statuses });
  });


//add status
  exports.addStatus=asyncHandler(async(req,res)=>{
 const userID = req.user.id; 
  const {newStatus}=req.body
  console.log(newStatus)
  
  const status=await addStatusServices(userID,newStatus)
  res.status(200).json({ success: true, status });
})
  

//change status name
exports.changeStatus = asyncHandler(async (req, res) => {
  const userID = req.user.id;
  const { oldStatus, newStatus } = req.body;
  const statusUpdate = await changeStatusServeices(userID, oldStatus, newStatus);
  res.status(200).json({ success: true, ...statusUpdate });
});

//delete status
exports.deletestatus=asyncHandler(async(req,res)=>{
  const userID=req.user.id
  const {status}=req.body;
  const updatedStatuses=await deleteStatusServices(userID,status)
  res.status(200).json({ message: "Status and related tasks deleted successfully", updatedStatuses});
})