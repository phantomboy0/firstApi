import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
interface tokenGenaratorInterface {
  userName: string;
  _id: ObjectId;
  loginAs: string;
}

class JwtService {
  tokenGenarator = async ({
    userName,
    _id,
    loginAs,
  }: tokenGenaratorInterface) => {
    return jwt.sign(
      { userName, _id, loginAs },
      String(process.env.JWT_SECRET_KEY),
      {
        expiresIn: process.env.JWT_EXPIRE_IN,
      }
    );
  };

  tokenVerify = async (token: string) => {
    try {
      return jwt.verify(token, String(process.env.JWT_SECRET_KEY));
    } catch (error: unknown) {
      return error;
    }
  };
}

export default new JwtService();
