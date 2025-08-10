import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_TOKEN = process.env.JWT_SECRET_TOKEN || "helloDrawisly";

export const generateJwtToken = (user : object) : string => {
    const token = jwt.sign(user,JWT_TOKEN);
    return token;   
}

export const verifiToken = (token : string) => {
    return jwt.verify(token,JWT_TOKEN) as JwtPayload
}