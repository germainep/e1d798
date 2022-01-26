const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, DATE } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id", "unread"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = {
        text: convoJSON.messages[convoJSON.messages.length - 1].text,
        read: convoJSON.messages[convoJSON.messages.length - 1].read,
      };

      // Counting messages in each conversation where the sender is not the current user
      const unreadCount =
        (await Message.count({
          where: {
            read: false,
            conversationId: convoJSON.id,
            senderId: {
              [Op.not]: userId,
            },
          },
        })) || 0;
      convoJSON.unread = unreadCount;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;

    // send the userId along to verify that the req.user is a member of the conversation
    const conversation = await Conversation.findById(req.params.id, userId);

    // the conversation will return null if the req.user is not a member of the conversation
    if (!conversation) {
      return res.sendStatus(403);
    }

    await Message.update(
      { read: true },
      {
        where: {
          conversationId: req.params.id,
          senderId: {
            [Op.not]: userId,
          },
        },
      }
    );

    const convoJSON = conversation.toJSON();

    if (convoJSON.user1) {
      convoJSON.otherUser = convoJSON.user1;
      delete convoJSON.user1;
    } else if (convoJSON.user2) {
      convoJSON.otherUser = convoJSON.user2;
      delete convoJSON.user2;
    }

    if (onlineUsers.includes(convoJSON.otherUser.id)) {
      convoJSON.otherUser.online = true;
    } else {
      convoJSON.otherUser.online = false;
    }

    convoJSON.latestMessageText = {
      text: convoJSON.messages[convoJSON.messages.length - 1].text,
      read: convoJSON.messages[convoJSON.messages.length - 1].read,
    };

    res.json(convoJSON);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
