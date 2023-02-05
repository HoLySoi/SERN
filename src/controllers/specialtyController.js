import specialtyService from "../services/specialtyService";

let createSpecialty = async (req, res) => {
  try {
    let infor = await specialtyService.createSpecialty(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from the server",
    });
  }
};

let getAllSpecialty = async (req, res) => {
  const { limit, offset, filter } = req.query;
  try {
    let infor = await specialtyService.getAllSpecialty(+limit, +offset, filter);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from the server",
    });
  }
};

let getDetailSpecialtyById = async (req, res) => {
  try {
    let infor = await specialtyService.getDetailSpecialtyById(
      req.query.id,
      req.query.location
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

let handleDeleteSpecialty = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "missing required parameters!",
    });
  }

  let message = await specialtyService.deleteSpecialty(req.body.id);
  return res.status(200).json(message);
};
let handleEditSpecialty = async (req, res) => {
  let data = req.body;
  let message = await specialtyService.updateSpecialtyData(data);
  return res.status(200).json(message);
};
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  handleDeleteSpecialty: handleDeleteSpecialty,
  handleEditSpecialty: handleEditSpecialty,
};
