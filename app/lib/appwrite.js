import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.fs.aorafs",
  projectId: "6639ddb5003a105e5b9b",
  databaseId: "663b044100305ed42a28",
  userCollectionId: "663b046a001956f95579",
  videoCollectionID: "663b0486003bf4601be7",
  storageId: "663b0610000d8938c463",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionID,
  storageId,
} = config;

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const session = await account.get();
    if (session) {
      await account.deleteSession(session.$id);
    }

    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatar.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message || "An error occurred while creating user");
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.get();
    if (session) {
      return;
    }
    const newSession = await account.createEmailPasswordSession(
      email,
      password
    );
    return newSession;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!createUser) throw Error;
    return currentUser.document[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionID);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
