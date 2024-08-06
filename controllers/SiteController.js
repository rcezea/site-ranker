import dbClient from '../utils/db';
import authenticateUser from "../utils/authUtils";
import handleUnauthorized from "../utils/errorUtils";
import { getSiteById, getUserById, insertDocument, validateSiteData } from "../utils/dbUtils";
import { ObjectId } from 'mongodb';

class SiteController {
  static async newSite(req, res) {
    try {
      const userId = await authenticateUser(req);
      if (!userId) return handleUnauthorized(res);

      const user = await getUserById(userId);
      if (!user) return handleUnauthorized(res);

      req.body.siteCategories = req.body.siteCategories.map(siteCategories =>
        siteCategories.toLowerCase().replaceAll(' ', '_'));

      const validation = await validateSiteData(req.body);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
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
    } catch (error) {
      console.error('Error in newSite:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async voteSite(req, res) {
    try {
      const userId = await authenticateUser(req);
      if (!userId) return handleUnauthorized(res);

      const user = await getUserById(userId);
      if (!user) return handleUnauthorized(res);

      const site = await getSiteById(req.params.id);
      if (!site) return res.status(400).json({ error: "Invalid site" });

      const checkVote = await dbClient.voteCollection.findOne({ userId: ObjectId(userId), siteId: site._id });
      if (checkVote) return res.status(400).json({ error: "You are allowed only one vote per site" });

      await dbClient.siteCollection.updateOne(site, { $inc: { votes: 1 } });

      const vote = {
        userId: ObjectId(userId),
        siteId: site._id,
      };
      await dbClient.voteCollection.insertOne(vote);

      return res.status(200).json({
        url: site.url,
        title: site.title,
        votes: site.votes + 1,
      });
    } catch (error) {
      console.error('Error in voteSite:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async unvoteSite(req, res) {
    try {
      const userId = await authenticateUser(req);
      if (!userId) return handleUnauthorized(res);

      const user = await getUserById(userId);
      if (!user) return handleUnauthorized(res);

      const site = await getSiteById(req.params.id);
      if (!site) return res.status(400).json({ error: "Invalid site" });

      const checkVote = await dbClient.voteCollection.findOne({ userId: ObjectId(userId), siteId: site._id });
      if (!checkVote) return res.status(400).json({ error: "You need to vote first" });

      await dbClient.siteCollection.updateOne(site, { $inc: { votes: -1 } });
      await dbClient.voteCollection.deleteOne(checkVote);

      return res.status(200).json({
        url: site.url,
        title: site.title,
        votes: site.votes - 1,
      });
    } catch (error) {
      console.error('Error in unvoteSite:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deleteSite(req, res) {
    try {
      const userId = await authenticateUser(req);
      if (!userId) return handleUnauthorized(res);

      const user = await getUserById(userId);
      if (!user || user.role !== 'admin') return handleUnauthorized(res);

      const site = await getSiteById(req.params.id);
      if (!site) return res.status(400).json({ error: "Invalid site" });

      await dbClient.voteCollection.deleteMany({ siteId: site._id });
      await dbClient.siteCollection.deleteOne(site);

      return res.status(204).json({ message: "Site deleted successfully" });
    } catch (error) {
      console.error('Error in deleteSite:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async createCategory(req, res) {
    try {
      const userId = await authenticateUser(req);
      if (!userId) return handleUnauthorized(res);

      const user = await getUserById(userId);
      if (!user || user.role !== 'admin') return handleUnauthorized(res);

      const category = {
        name: req.body ? (req.body.name).toLowerCase() : null,
        desc: req.body ? req.body.desc : null,
      };

      if (!category.name || !category.desc) return res.status(400).json({ error: "Missing field" });
      if (await dbClient.categoryCollection.findOne({ name: category.name })) {
        return res.status(400).json({ error: "Category already exists" });
      }

      await dbClient.categoryCollection.insertOne(category);

      return res.status(200).json({ message: "Category created" });
    } catch (error) {
      console.error('Error in createCategory:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateSiteCategory(req, res) {
    try {
      const userId = await authenticateUser(req);
      if (!userId) return handleUnauthorized(res);

      const user = await getUserById(userId);
      if (!user) return handleUnauthorized(res);

      const site = await getSiteById(req.params.id);
      if (!site) return res.status(400).json({ error: "Invalid site" });
      if (site.userId !== userId && user.role !== 'admin') return handleUnauthorized(res);

      const category = (req.body.category).toLowerCase().replaceAll(' ', '_');
      if (site.categories.includes(category)) return res.status(400).json({ error: "Category already included" });

      const categories = await dbClient.categoryCollection.find({}, {
        projection: { _id: 0, name: 1 }
      }).toArray();

      const namesList = categories.map(category => category.name);
      if (!namesList.includes(category)) return res.status(400).json({ error: `${category} is not a category` });

      await dbClient.siteCollection.updateOne(site, { $push: { categories: category } });

      return res.status(200).json({ message: "Site updated" });
    } catch (error) {
      console.error('Error in updateSiteCategory:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const userId = await authenticateUser(req);
      if (!userId) return handleUnauthorized(res);

      const user = await getUserById(userId);
      if (!user || user.role !== 'admin') return handleUnauthorized(res);

      const category = await dbClient.categoryCollection.findOne({ name: (req.body.name).toLowerCase() });
      if (!category) return res.status(400).json({ error: "Category does not exist" });

      await dbClient.categoryCollection.deleteOne(category);
      return res.status(200).json({ message: "Category deleted" });
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getCategories(req, res) {
    try {
      const category = await dbClient.categoryCollection.find({}, {
        projection: { _id: 0, name: 1 }
      }).toArray();
      const categories = category.map(category => category.name);
      return res.status(200).json({ categories });
    } catch (error) {
      console.error('Error in getCategories:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getAllSites(req, res) {
    try {
      const sites = await dbClient.siteCollection.find({}, {
        projection: {
          title: '$title',
          url: '$url',
          desc: '$desc',
          categories: '$categories',
          votes: '$votes'
        }
      }).toArray();
      return res.status(200).json({ sites });
    } catch (error) {
      console.error('Error in getAllSites:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async searchSites(req, res) {
    const { query, categories, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = (pageNum - 1) * limitNum;

    const searchQuery = {
      $and: []
    };

    if (query) {
      searchQuery.$and.push({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { desc: { $regex: query, $options: 'i' } },
          { categories: { $regex: query, $options: 'i' } }
        ]
      });
    }

    if (searchQuery.$and.length === 0) delete searchQuery.$and;

    const sites = await dbClient.siteCollection.find(searchQuery)
      .sort({ votes: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .project({
        title: 1,
        url: 1,
        desc: 1,
        categories: 1,
        votes: 1
      }).toArray();

    const totalSites = await dbClient.siteCollection.countDocuments(searchQuery);

    return res.status(200).json({
      sites,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalSites / limitNum),
        totalSites
      }
    });
  }
}

export default SiteController;
