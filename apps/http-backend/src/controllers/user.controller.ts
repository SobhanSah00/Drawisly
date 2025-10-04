import { prisma } from "@repo/db/client"
import { UserSignUpSchema, UserSignInSchema } from "@repo/common/type"
import { Request, Response } from "express"
import { hashPassword, comparePassword } from "../utils/hash.util";
import { generateJwtToken } from "../utils/jwt.util";
import { verifiToken } from "../utils/jwt.util"

export async function signUpController(req: Request, res: Response) {
  const validatedInput = UserSignUpSchema.safeParse(req.body);

  // ✅ Correct validation check
  if (!validatedInput.success) {
    res.status(400).json({
      message: "Invalid input",
      error: validatedInput.error.format(), // uncomment if you want detailed errors
    });
    return;
  }

  const { email, username, password } = validatedInput.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(409).json({ error: "User already exists!" });
    return;
  }

  try {
    const hashedPassword = await hashPassword(password);

    const userCreated = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const user = {
      id: userCreated.id,
      username: userCreated.username,
      email: userCreated.email,
      photo: userCreated.photo,
    };

    const token = generateJwtToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      message: "User signed up successfully.",
      user,
      token,
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function signInController(req: Request, res: Response) {

  const validatedInput = UserSignInSchema.safeParse(req.body);

  if (validatedInput.error) {
    res.status(404).json({
      message: "Invalid Inputs",
    });
    return;
  }

  try {
    const userFound = await prisma.user.findFirst({
      where: {
        username: validatedInput.data.username
      },
    });
    if (!userFound) {
      res.status(404).json({
        message: "The username does not exist",
      });
      return;
    }
    const validatedPassword = comparePassword(validatedInput.data.password, userFound.password)
    if (!validatedPassword) {
      res.status(404).json({
        message: "The password is incorrect",
      });
      return;
    }
    const user = {
      id: userFound.id,
      username: userFound.username,
      name: userFound.username,
      photo: userFound.photo,
    };
    const token = generateJwtToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "User Signed In",
      user: user,
      token,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(401).json({
      message: "Error faced while loging user in, try again",
    });
  }
};

export async function signOutController(req: Request, res: Response) {
  res.clearCookie("jwt");
  res.json({
    message: "User log out ."
  })
}

export async function getCurrentUser(req: Request, res: Response) {
  const userId = req.userId

  try {
    const FoundedUser = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    const user = {
      id: FoundedUser?.id,
      username: FoundedUser?.username,
      email: FoundedUser?.email,
      photo: FoundedUser?.photo
    }

    res.status(200).json({
      message: "User Information",
      user
    })
  } catch (error) {
    res.status(401).json({
      message: "Error faced while getting user info, try again"
    })
  }
}

export async function getToken(req: Request, res: Response) {
  let token = req.cookies['jwt'];

  if (!token) {
    res.status(401).json({
      message: "User is not authorized ."
    })
    return;
  }

  res.status(200).json({
    message : "Token Fetched SuccessFully",
    token
  })
}