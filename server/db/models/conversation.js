const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");
const User = require("./user");

const Conversation = db.define("conversation", {});

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
      id: conversationId,
    },
    include: ["user1", "user2"],
  });
  if (conversation.user1) {
    conversation.otherUser = conversation.user1;
    delete conversation.user1;
  } else if (conversation.user2) {
    conversation.otherUser = conversation.user2;
    delete conversation.user2;
  }

  return conversation;
};

module.exports = Conversation;
