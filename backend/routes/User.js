const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();
const secret = process.env.SECRET_KEY;

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "dzelapino",
      sub: userID,
    },
    secret,
    { expiresIn: "1h" }
  );
};

userRouter.post("/register", (req, res) => {
  const { username, password, neoId } = req.body;
  User.findOne({ username: username }, (err) => {
    if (err)
      res.status(500).json({
        message: { msgBody: "Error during registration", msgError: true },
      });
    else {
      const newUser = new User({
        username,
        password,
        neoId,
      });
      newUser.save((err) => {
        if (err)
          res.status(400).json({
            message: {
              msgBody: "Username is already in use",
              msgError: true,
            },
          });
        else
          res.status(201).json({
            message: { msgBody: "Account has been created", msgError: false },
          });
      });
    }
  });
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    console.log("login try");
    if (req.isAuthenticated()) {
      const { _id, username, neoId } = req.user;
      const tokenData = {
        isAuthenticated: true,
        username: username,
        id: _id,
        neoId: neoId,
      };
      const token = signToken(tokenData);
      res.cookie("access_token", token, { httpOnly: false, sameSite: true, secure: true});
      res.status(200).json({
        isAuthenticated: true,
        username: username,
        id: _id,
        neoId: neoId,
      });
    }
  }
);

userRouter.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // ? DZIAŁA
    if (req.isAuthenticated()) {
      res.status(200).json({
        isAuthenticated: true,
        userId: JWT.decode(req.cookies.access_token).sub,
      });
    }
    res.status(401).json({
      message: {
        msgBody: `You need to be signed in.`,
      },
      msgError: true,
    });
  }
);

userRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (_req, res) => {
    res.clearCookie("access_token" , { httpOnly: false, sameSite: true, secure: true});
    res.json({ user: { username: "" }, success: true });
  }
);

userRouter.get("/", async (_req, res) => {
  try {
    const result = await User.find({});
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({
      message: { msgBody: "Error while fetching users", msgError: true },
    });
  }
});

userRouter.get("/getById/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    const result = await User.findById(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while fetching user with id: ${req.params.userId}`,
      },
      msgError: true,
    });
  }
});

userRouter.delete("/clearAll", async (_req, res) => {
  try {
    const result = await User.deleteMany({});
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({
      message: { msgBody: "Error while fetching users", msgError: true },
    });
  }
});

module.exports = userRouter;
