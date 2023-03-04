require("dotenv").config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"TRUNG TÂM Y TẾ TOÀN HỒ" <holysoi.toan@gmail.com>', // sender address
    to: dataSend.reciverEmail,
    subject: "TRUNG TÂM Y TẾ TOÀN HỒ - Thông tin đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
    html: getBodyHTMLEmail(dataSend),
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}!</h3> 
    <p>Hệ thống Đặt lịch khám chữa bệnh đã nhận được yêu cầu đặt lịch của bạn. </p>
    <p>Thông tin đặt lịch khám bệnh: </p>
    <div><b>Thời gian ${dataSend.time} </b></div> 
    <div><b>Bác sĩ: ${dataSend.doctorName} </b></div> 
    <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link bên dưới để xác
    nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
    <div> 
    <a href= ${dataSend.redirectLink} target="_blank" >Xác nhận</a> 
    </div> 
    <div> Xin chân thành cảm ơn!</div>
    `;
  }

  if (dataSend.language === "en") {
    result = `
    <h3>Dear ${dataSend.patientName}!</h3> 
    <p>Your appointment booking system has received your booking request.</p>
    <p>Information to book a medical appointment: </p>
    <div><b>Time ${dataSend.time} </b></div> 
    <div><b>Doctor: ${dataSend.doctorName} </b></div> 
    <p>If the above information is correct, please click on the link below to confirm and complete the procedure to book an appointment.</p>
    <div> 
    <a href= ${dataSend.redirectLink} target="_blank" >Click here</a> 
    </div> 
    <div> Sincerely thank!</div>
    `;
  }

  return result;
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}!</h3> 
    <p>Hệ thống kính gửi bạn kết quả khám chữa bệnh, chi tiết xem tại file đính kèm.</p>
    <div> Xin chân thành cảm ơn!</div>
    `;
  }

  if (dataSend.language === "en") {
    result = `
    <h3>Dear ${dataSend.patientName}!</h3> 
    <p>The system sends you the results of medical examination and treatment, see details in the attached file.</p>
    <div> Sincerely thank!</div>
    `;
  }

  return result;
};

let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      //create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      let info = await transporter.sendMail({
        from: '"TRUNG TÂM Y TẾ TOÀN HỒ" <holysoi.toan@gmail.com>', // sender address
        to: dataSend.email,
        subject: "Kết quả khám chữa bệnh", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            filename: `remedy-${
              dataSend.patientId
            }-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });

      resolve(true);
    } catch (error) {
      reject(e);
    }
  });
};

let sendCancelBookingEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"TRUNG TÂM Y TẾ TOÀN HỒ" <holysoi.toan@gmail.com>', // sender address
    to: dataSend.reciverEmail,
    subject: "TRUNG TÂM Y TẾ TOÀN HỒ - Thông tin đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
    html: getCancelBookingEmail(dataSend),
  });
};

let getCancelBookingEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}!</h3> 
    <p>Yêu cầu đặt lịch của bạn đã bị từ chối hủy với thông tin như bên dưới.</p>
    <p>Thông tin: </p>
    <div><b>Thời gian ${dataSend.time} </b></div> 
    <div><b>Bác sĩ: ${dataSend.doctorName} </b></div> 
    <div><b>Lý do: ${dataSend.reason} </b></div> 

    <div> Xin chân thành cảm ơn!</div>
    `;
  }

  if (dataSend.language === "en") {
    result = `
    <h3>Dear ${dataSend.patientName}!</h3> 
    <p>Your booking request has been denied and canceled with the information as below.</p>
    <p>Information: </p>
    <div><b>Time ${dataSend.time} </b></div> 
    <div><b>Doctor: ${dataSend.doctorName} </b></div> 
    <div><b>Reason: ${dataSend.reason} </b></div> 
 
    <div> Sincerely thank!</div>
    `;
  }

  return result;
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
  sendCancelBookingEmail: sendCancelBookingEmail,
};
