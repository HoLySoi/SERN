const db = require("../models");

let createHandbook = (data) => {
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
        await db.Handbook.create({
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

let getAllHandbook = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Handbook.findAll({});
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

let getDetailHandbookById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Handbook.findOne({
          where: {
            id: inputId,
          },
          attributes: [
            "name",
            // "image",
            "descriptionHTML",
            "descriptionMarkdown",
          ],
        });
        // if (data) {
        //   let doctorHandbook = [];
        //   doctorHandbook = await db.Doctor_Infor.findAll({
        //     where: {
        //       handbookId: inputId,
        //     },
        //     attributes: ["doctorId", "provinceId"],
        //   });

        //   data.doctorHandbook = doctorHandbook;
        // } else data = {};
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

let deleteHandbook = (handbookId) => {
  return new Promise(async (resolve, reject) => {
    let foundHandbook = await db.Handbook.findOne({
      where: { id: handbookId },
    });
    if (!foundHandbook) {
      resolve({
        errCode: 2,
        errMessage: "the handbook is not exist",
      });
    }

    await db.Handbook.destroy({
      where: { id: handbookId },
    });
    resolve({
      errCode: 0,
      errMessage: "the handbook is deleted",
    });
  });
};
module.exports = {
  createHandbook: createHandbook,
  getAllHandbook: getAllHandbook,
  getDetailHandbookById: getDetailHandbookById,
  deleteHandbook: deleteHandbook,
};
