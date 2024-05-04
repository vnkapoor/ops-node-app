
module.exports = async (error, req, res, next) => {
 
  const errStatus = 500;
  const errMsg = 'Something went wrong';
  res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMsg,
      stack: null
  })
};
