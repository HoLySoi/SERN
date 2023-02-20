const jwt = require("jsonwebtoken")

export const jwtSign = (data, secret) => {
    if (!secret) {
        secret = process.env.SECRET
    }
    const token = jwt.sign(data, secret);
    return token;
};

export const jwtDecode = (code, secret) => {
    if (!secret) {
        secret = process.env.SECRET
    }
    const data = jwt.verify(code, secret)
    return data;
}

export const getAuthentication = (req) => {
    const authentication = req.headers['authentication'];
    const secret = process.env.SECRET;
    const code = authentication ? authentication.slice(7) : ""
    return jwt.verify(code, secret);
}