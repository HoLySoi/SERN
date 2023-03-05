const jwt = require("jsonwebtoken");

const jwtSign = (data, secret) => {
    if (!secret) {
        secret = process.env.SECRET;
    }
    const token = jwt.sign(data, secret);
    return token;
};

const jwtDecode = (code, secret) => {
    if (!secret) {
        secret = process.env.SECRET;
    }
    const data = jwt.verify(code, secret);
    return data;
};

const getAuthentication = (req) => {
    const authentication = req.headers["authentication"];
    const secret = process.env.SECRET;
    const code = authentication ? authentication.slice(7) : "";
    return jwt.verify(code, secret);
};

module.exports = {
    jwtSign,
    jwtDecode,
    getAuthentication,
};
