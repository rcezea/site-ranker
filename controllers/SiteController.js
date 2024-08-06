import dbClient from '../utils/db';
import authenticateUser from "../utils/authUtils";
import handleUnauthorized from "../utils/errorUtils";
import {getUserById, insertDocument, validateSiteData} from "../utils/dbUtils";
import { ObjectId } from 'mongodb';

class SiteController {
  static async newSite(req, res) {
    const userId = await authenticateUser(req);
    if (!userId) return handleUnauthorized(res);
    const user = await getUserById(userId);
    if (!user) return handleUnauthorized(res);

    const validation = await validateSiteData(req.body);

    if (!validation.valid) {
      return res.status(400).json({error: validation.message});
    }

    const site = {
      userId: ObjectId(userId),
      url: req.body.siteUrl,
      title: req.body.siteName,
      desc: req.body.siteDesc || '',
      categories: req.body.siteCategories,
      votes: 0,
    };

    const newSite = await insertDocument('siteCollection', site);
    return res.status(201).json({
      id: newSite.insertedId.toString(),
      userId,
      url: site.url,
      title: site.title,
      desc: site.desc,
      categories: site.categories,
      votes: 0,
    });
  }
}

export default SiteController;
