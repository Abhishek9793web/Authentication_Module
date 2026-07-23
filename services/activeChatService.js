const activeChats = new Map();

const setActiveChat = (userId, conversationId) => {
  activeChats.set(userId.toString(), conversationId.toString());
};

const removeActiveChat = (userId) => {
  activeChats.delete(userId.toString());
};

const getActiveChat = (userId) => {
  return activeChats.get(userId.toString());
};

module.exports = {
  setActiveChat,
  removeActiveChat,
  getActiveChat
};
