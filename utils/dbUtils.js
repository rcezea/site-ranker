// utils/dbUtils.js
import { ObjectId } from 'mongodb';
import dbClient from './db';

export async function getUserById(userId) {
  // eslint-disable-next-line no-return-await
  return await dbClient.userCollection.findOne({ _id: new ObjectId(userId) });
}

export async function insertDocument(collection, document) {
  // eslint-disable-next-line no-return-await
  return await dbClient[collection].insertOne(document);
}

export async function validateSiteData (data) {
  const { siteUrl, siteName, siteCategories } = data;

  if (!siteUrl || !siteName || !Array.isArray(siteCategories) || siteCategories.length === 0) {
    return {
      valid: false,
      message: 'siteUrl, siteName, and at least one category are required.'
    };
  }

  // Check if siteUrl starts with 'https://'
  if (!/^https:\/\/.+/.test(siteUrl)) {
    return {
      valid: false,
      message: 'The URL must start with \'https://\'.'
    };
  }

  // Check if the URL already exists in the database
  const existingSite = await dbClient.siteCollection.findOne({ url: siteUrl });
  if (existingSite) {
    return {
      valid: false,
      message: 'A site with this URL already exists.'
    };
  }


  const categories = await dbClient.categoryCollection.find({}, {
    projection: {
      _id: 0,
      name: 1
    }
  }).toArray();
  const namesList = categories.map(category => category.name);
  for (const cat of siteCategories) {
    if (!namesList.includes(cat)) {
      return {
        valid: false,
        message: `${cat} is not a category`,
      }
    }
  }
  return { valid: true };
}

export async function getSiteById(siteId) {
  return await dbClient.siteCollection.findOne({ _id: ObjectId(siteId) });
}
