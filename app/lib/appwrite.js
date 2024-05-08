import { Client, Account, ID, Avatars, Databases } from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.fs.aorafs",
  projectId: "6639ddb5003a105e5b9b",
  databaseId: "663b044100305ed42a28",
  userCollectionId: "663b046a001956f95579",
  videoCollectionID: "663b0486003bf4601be7",
  storageId: "663b0610000d8938c463",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) {
      throw Error;
    }
    const avatarUrl = avatar.getInitials(username);
    await singIn(email, password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$Id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function singIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}
