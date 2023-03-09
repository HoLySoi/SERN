const { Op } = require("sequelize");
const db = require("../models");

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: "OKE",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllSpecialty = (limit = 0, offset = 0, filter = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll({
        limit,
        offset,
        where: {
          name: {
            [Op.substring]: filter,
          },
        },
      });
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "OKE",
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = {
          doctorSpecialty: [],
          descriptionHTML: "",
          descriptionMarkdown: ""
        };
        const specialty = await db.Specialty.findOne({
          where: {
            id: inputId,
          },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });
        if (specialty) {
          data.descriptionHTML = specialty.descriptionHTML
          data.descriptionMarkdown = specialty.descriptionMarkdown
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            //find by location
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location,
              },
              attributes: ["doctorId", "provinceId"],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
          console.log(data)
        } else data = {};
        resolve({
          errCode: 0,
          errMessage: "OKE",
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteSpecialty = (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    let foundSpecialty = await db.Specialty.findOne({
      where: { id: specialtyId },
    });
    if (!foundSpecialty) {
      resolve({
        errCode: 2,
        errMessage: "the specialty is not exist",
      });
    }

    await db.Specialty.destroy({
      where: { id: specialtyId },
    });
    resolve({
      errCode: 0,
      errMessage: "the specialty is deleted",
    });
  });
};
let updateSpecialtyData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.name ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let specialty = await db.Specialty.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (specialty) {
        specialty.name = data.name;
        specialty.descriptionHTML = data.descriptionHTML;
        specialty.descriptionMarkdown = data.descriptionMarkdown;

        if (data.imageBase64) {
          specialty.imageBase64 = data.imageBase64;
        }

        await specialty.save();

        resolve({
          errCode: 0,
          errMessage: "Update the specialty succeeds",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Specialty is not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  deleteSpecialty: deleteSpecialty,
  updateSpecialtyData: updateSpecialtyData,
};
