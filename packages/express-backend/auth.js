import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getAllUsers,
  getUserById,
  addUser,
  deleteUserById,
  getUserByName
} from "./user.js";

export async function registerUser(req, res) {
  const { username, pwd } = req.body; // from form

  if (!username || !pwd) {
    res.status(400).send("Bad request: Invalid input data.");
  } else if (getUserByName(username)) {
    res.status(409).send("Username already taken");
  } else {
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(pwd, salt))
      .then((hashedPassword) => {
        generateAccessToken(username).then(async (token) => {
          console.log("Token:", token);
          res.status(201).send({ token: token });
          try {
            const savedUser = await addUser({ username, hashedPassword });
            res.status(201).send(savedUser);
          } catch (error) {
            console.error(error);
            res.status(500).send("Error saving user");
          }
        });
      });
  }
}

function generateAccessToken(id) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id: id },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      (error, decoded) => {
        if (decoded) {
          req.body.id = decoded.id;
          next();
        } else {
          console.log("JWT error:", error);
          res.status(401).end();
        }
      }
    );
  }
}

export async function loginUser(req, res) {
  const { username, pwd } = req.body; // from form
  const retrievedUser = await getUserByName(username);

  if (!retrievedUser) {
    // invalid username
    res.status(401).send("Unauthorized");
  } else {
    bcrypt
      .compare(pwd, retrievedUser.password)
      .then((matched) => {
        if (matched) {
          generateAccessToken(retrievedUser.id).then((token) => {
            res.status(200).send({ token: token });
          });
        } else {
          // invalid password
          res.status(401).send("Unauthorized");
        }
      })
      .catch(() => {
        res.status(401).send("Unauthorized");
      });
  }
}
