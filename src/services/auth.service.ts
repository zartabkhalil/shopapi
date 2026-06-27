import bcrypt from "bcryptjs";
import { AppError } from "../lib/appError.lib";
import JwtService from "../lib/jwt.service";
import UserRepoistory from "../repositories/user.repository";
import { CreateUserInput, LoginInput } from "../types/auth.types";

export default class AuthService {
  private userRepository: UserRepoistory;
  private jwtService: JwtService;
  constructor() {
    this.userRepository = new UserRepoistory();
    this.jwtService = new JwtService();
  }

  login = async (data: LoginInput) => {
    //:: find user if not found throw error
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Email or Password Invalid", 401);
    }

    //:: haspassword and match if not throw error
    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatch) {
      throw new AppError("Email or Password Invalid", 401);
    }

    //::create access token
    const token = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });
    const { password, ...safeUser } = user;

    return { accessToken: token, user: safeUser };
  };
  register = async (data: CreateUserInput) => {
    //:::: check duplication
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError("User already exists", 409);
    }

    //:::: hashedPassword
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //::Create Account if check passed

    const result = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
    });
    const { password, ...safeUser } = result;
    return safeUser;
  };
}
