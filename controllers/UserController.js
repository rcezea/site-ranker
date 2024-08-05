import redisClient from "../utils/redis";
import dbClient from "../utils/db";
import sha1 from 'sha1';
import {getUserById, insertDocument} from "../utils/dbUtils";
import authenticateUser from "../utils/authUtils";
import handleUnauthorized from "../utils/errorUtils";

class UserController {
  static async createNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    const role = req.body.role === 'admin' ? 'admin' : 'user';


    if (!email) {
      console.log("No email");
      return res.status(400).json({error: "Missing email"})
    }
    if (!password) return res.status(400).json({error: "Missing password"})

    const userOld = await dbClient.userCollection.findOne({email});
    if (userOld) return res.status(400).json({error: `Account already exists for ${email}`})

    const user = { role, email, password: sha1(password) };
    const newUser = await insertDocument('userCollection', user);
    const userId = newUser.insertedId.toString();

    return res.status(201).json({ id: userId, email, role });
  }

  static async getMe(req, res) {
    const userId = await authenticateUser(req);
    // if (!userId) return handleUnauthorized(res);

    const user = await getUserById(userId);
    if (!user) return handleUnauthorized(res);

    return res.status(200).json({ id: userId, email: user.email });
  }

  static async deleteUser(req, res) {
    const userId = await authenticateUser(req);
    const user = await getUserById(userId);
    if (!user || user.role !== 'admin') return handleUnauthorized(res);


    // get user to delete
    const delUser = getUserById(req.body.delete_user_id);
    if (!delUser) return res.status(400).json({error: "User does not exist"});
    await dbClient.userCollection.deleteOne(delUser);

    return res.status(200).json({message: "Account deleted"});
  }

  static async deleteSite(req, res){

  }
}

export default UserController;
