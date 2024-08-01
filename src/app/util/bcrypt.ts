import bcrypt from "bcrypt";

const saltRounds = Number(process.env.SALT_ROUNDS);

class BcryptService {
  hashPassword = (password: string) => bcrypt.hashSync(password, saltRounds);

  comparePassword = async (password: string, hashedPassword: string) =>
    bcrypt.compareSync(password, hashedPassword);
}

export default new BcryptService();
