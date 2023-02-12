const express = require("express");
const messageRouter = express.Router();
const passport = require("passport");
const Message = require("../models/Message");

messageRouter.post("/", (req, res) => {
  const { message, user, channel } = req.body;
  const newMessage = new Message({
    message,
    user,
    channel,
  });
  try {
    newMessage.save((err) => {
      if (err)
        res
          .status(400)
          .json({
            message: { msgBody: "Error during message save", msgError: true },
          });
      else
        res
          .status(201)
          .json({ message: { msgBody: "Message saved", msgError: false } });
    });
  } catch (error) {
    res.status(400).json({ message: { msgBody: error, msgError: true } });
  }
});

messageRouter.get("/", async (_req, res) => {
  try {
    const result = await Message.find({});
    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: { msgBody: "Error while fetching messages", msgError: true },
      });
  }
});

messageRouter.get("/byChannel/:channel", async (req, res) => {
  try {
    const channel = req.params.channel;
    const result = await Message.find({ channel: channel });
    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: { msgBody: "Error while fetching messages", msgError: true },
      });
  }
});

messageRouter.get("/getLastFromChannel/:channel/:number", async (req, res) => {
    try {
      const channel = req.params.channel;
      const number = req.params.number;
      const result = await Message.find({ channel: channel });
      res.status(200).send(result.slice(-number));
    } catch (error) {
      res
        .status(500)
        .json({
          message: { msgBody: "Error while fetching messages", msgError: true },
        });
    }
  });

module.exports = messageRouter;
