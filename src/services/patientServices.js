const db = require("../models/index");
require("dotenv").config();
const emailService = require("./emailService");
const { v4: uuidv4 } = require("uuid");

let buildUrlEmail = (doctorId, token = "") => {
  if (!token) return `${process.env.URL_REACT}/detail-doctor/${doctorId}`;
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};
//Đặt lịch hẹn
let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.phoneNumber ||
        !data.address
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          reciverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        //upsert patient
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            phonenumber: data.phoneNumber,
            address: data.address,
            firstName: data.fullName,
          },
        });
        //create a booking record
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id, statusId: "S1" },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save infor patient succeed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

//Xác nhận email
let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();

          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let cancelBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.fullName ||
        !data.timeString ||
        !data.doctorName ||
        !data.reason ||
        !data.doctorId
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let user = await db.User.findOne({
          where: { email: data.email },
        });
        //create a booking record
        if (user) {
          const booking = await db.Booking.findOne({
            where: {
              patientId: user.id,
              statusId: "S2",
              timeType: data.timeType,
              date: data.date,
            },
          });
          booking.statusId = "S4";
          await booking.save();
        }

        await emailService.sendCancelBookingEmail({
          reciverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          reason: data.reason,
          redirectLink: buildUrlEmail(data.doctorId),
        });

        resolve({
          errCode: 0,
          errMessage: "Cancel succeed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  cancelBookAppointment: cancelBookAppointment,
};
