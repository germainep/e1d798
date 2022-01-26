const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");
const User = require("./user");

const Conversation = db.define("conversation", {
  unread: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id],
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id],
      },
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

// Find a conversation by the conversationId
Conversation.findById = async function (conversationId, userId) {
  const conversation = await Conversation.findOne({
    where: {
      [Op.and]: {
        id: conversationId,

        // makes sure to check that the req.user.id is one of the conversations users
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
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

  return conversation;
};

module.exports = Conversation;
