import { prisma } from "@repo/db/client"
import { UserSignUpSchema, UserSignInSchema } from "@repo/common/type"
import { Request, Response, RequestHandler } from "express"
import { hashPassword } from "../utils/hash.util";
import { generateJwtToken } from "../utils/jwt.util";

export const signUp = async (req : Request, res : Response) => {
  const validatedInput = UserSignUpSchema.safeParse(req.body);

  if (!validatedInput.success) {
    return res.status(400).json({
      message: "Invalid input",
      error: validatedInput.error.format()
    });
  }

  const { email, username, password } = validatedInput.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ error: "User already exists!" });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const userCreated = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    const user = {
      id: userCreated.id,
      username: userCreated.username,
      email: userCreated.email,
      photo: userCreated.photo
    };

    const token = generateJwtToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: "User signed up successfully.",
      user,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
