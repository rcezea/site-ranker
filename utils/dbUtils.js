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

  return { valid: true };
}

