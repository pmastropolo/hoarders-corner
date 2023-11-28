const typeDefs = `
 type User {
    _id: ID
    username: String
    email: String
    messagesSent: [Message]
    messagesReceived: [Message]
    communities: [Community]
    items: [Item]
 }

 type Community {
   _id: ID
   name: String
   tagline: String
   description: String
   items: [Item]
   users: [User]
 }

 type Item {
   _id: ID
   name: String
   description: String
   owner: String
   isPublic: Boolean
   ownerId: User
   community: String
   imageUrl: String
 }

 type Message {
   _id: ID
   sender: String
   recipient: String
   createdAt: String
   content: String
   isRead: Boolean
 }

 type Auth {
    token: ID!
    user: User
 }


 type Query {
    users: [User]
    me: User

    communities: [Community]!
    community(communityId: ID!): Community
    myCommunities: User
    communityName(name: String!): Community

    items: [Item]
    itemByCommunity(communityId: String!): Community
    item(itemId: ID!): Item
    itemName(name: String): Item

    myHoards: User
    myHoard(communityId: String!): [Item]

    messages: [Message]
    message(messageId: ID!): Message
    myMessages: User
 }

 type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    addCommunity(name: String!, tagline: String, description: String): Community
    joinCommunity(communityId: ID!): Community
    leaveCommunity(communityId: ID!): User

    createItem(name: String!, description: String!, owner: String!, isPublic: Boolean!, community: String!, communityId: String!, imageUrl: String): Item
    addItemToCommunity(itemId: ID!, communityId: ID!): Item
    updateItemPublic(itemId: String!): Item
    deleteItem(itemId: String!): Item
    
    sendMessage(sender: String!, recipient: String!, content: String): Message
    markMessageRead(_id: ID): Message
 }
`;
module.exports = typeDefs;
