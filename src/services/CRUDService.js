const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const db = require("../models/index");

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });

      resolve("creat new User succes");
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save();
        let allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  });
};

let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await user.destroy();
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};

let searchAll = async (search = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = {
        clinic: [],
        specialty: [],
        doctor: [],
        // handbook: [],
      };

      // clinic
      const clinic = await db.Clinic.findAll({
        attributes: ["name", "image", "id"],
        where: {
          name: {
            [Op.substring]: search,
          },
        },
      });

      if (clinic && clinic.length > 0) {
        clinic.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }

      //specialties
      const specialty = await db.Specialty.findAll({
        attributes: ["name", "image", "id"],
        where: {
          name: {
            [Op.substring]: search,
          },
        },
      });

      if (specialty && specialty.length > 0) {
        specialty.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }

      // doctor
      const doctor = await db.User.findAll({
        attributes: ["firstName", "lastName", "image", "id"],
        where: {
          roleId: "R2",
          [Op.or]: [
            {
              firstName: {
                [Op.substring]: search,
              },
            },
            {
              lastName: {
                [Op.substring]: search,
              },
            },
          ],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });

      if (doctor && doctor.length > 0) {
        doctor.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }

      // handbook
      // const handbook = await db.Handbook.findAll({
      //   attributes: ["name", "image"],
      //   where: {
      //     name: {
      //       [Op.substring]: search,
      //     },
      //   },
      // });

      // if (handbook && handbook.length > 0) {
      //   handbook.map((item) => {
      //     item.image = new Buffer(item.image, "base64").toString("binary");
      //     return item;
      //   });
      // }

      data.clinic = clinic;
      data.specialty = specialty;
      data.doctor = doctor;
      // data.handbook = handbook;

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

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
  searchAll: searchAll,
};
