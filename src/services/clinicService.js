const db = require("../models");

let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
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

// let getAllClinic = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let data = await db.Specialty.findAll({});
//       if (data && data.length > 0) {
//         data.map((item) => {
//           item.image = new Buffer(item.image, "base64").toString("binary");
//           return item;
//         });
//       }
//       resolve({
//         errCode: 0,
//         errMessage: "OKE",
//         data,
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// let getDetailSpecialtyById = (inputId, location) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!inputId || !location) {
//         resolve({
//           errCode: 1,
//           errMessage: "Missing parameter",
//         });
//       } else {
//         let data = await db.Specialty.findOne({
//           where: {
//             id: inputId,
//           },
//           attributes: ["descriptionHTML", "descriptionMarkdown"],
//         });
//         if (data) {
//           let doctorSpecialty = [];
//           if (location === "ALL") {
//             doctorSpecialty = await db.Doctor_Infor.findAll({
//               where: { specialtyId: inputId },
//               attributes: ["doctorId", "provinceId"],
//             });
//           } else {
//             //find by location
//             doctorSpecialty = await db.Doctor_Infor.findAll({
//               where: {
//                 specialtyId: inputId,
//                 provinceId: location,
//               },
//               attributes: ["doctorId", "provinceId"],
//             });
//           }
//           data.doctorSpecialty = doctorSpecialty;
//         } else data = {};
//         resolve({
//           errCode: 0,
//           errMessage: "OKE",
//           data,
//         });
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

module.exports = {
  createClinic: createClinic,
  //   getAllSpecialty: getAllSpecialty,
  //   getDetailSpecialtyById: getDetailSpecialtyById,
};
