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

let getDetailHandbookById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Handbook.findOne({
          where: {
            id: inputId,
          },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          let doctorHandbook = [];
          if (location === "ALL") {
            doctorHandbook = await db.Doctor_Infor.findAll({
              where: { handbookId: inputId },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            //find by location
            doctorHandbook = await db.Doctor_Infor.findAll({
              where: {
                handbookId: inputId,
                provinceId: location,
              },
              attributes: ["doctorId", "provinceId"],
            });
          }
          data.doctorHandbook = doctorHandbook;
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

module.exports = {
  createHandbook: createHandbook,
  getAllHandbook: getAllHandbook,
  getDetailHandbookById: getDetailHandbookById,
};
