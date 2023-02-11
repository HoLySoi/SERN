const handbookService = require("../services/handbookService");

let createHandbook = async (req, res) => {
  try {
    let infor = await handbookService.createHandbook(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from the server",
    });
  }
};

let getAllHandbook = async (req, res) => {
  try {
    let infor = await handbookService.getAllHandbook();
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from the server",
    });
  }
};

let getDetailHandbookById = async (req, res) => {
  try {
    let infor = await handbookService.getDetailHandbookById(
      req.query.id
      // req.query.location
    );
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from the server",
    });
  }
};

let handleDeleteHandbook = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "missing required parameters!",
    });
  }

  let message = await handbookService.deleteHandbook(req.body.id);
  return res.status(200).json(message);
};

let handleEditHandbook = async (req, res) => {
  let data = req.body;
  let message = await handbookService.updateHandbookData(data);
  return res.status(200).json(message);
};

module.exports = {
  createHandbook: createHandbook,
  getAllHandbook: getAllHandbook,
  getDetailHandbookById: getDetailHandbookById,
  handleDeleteHandbook: handleDeleteHandbook,
  handleEditHandbook: handleEditHandbook,
};
