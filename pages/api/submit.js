import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const ip = getClientIp(req);
    const filePath = path.join(process.cwd(), 'data', 'submissions.json');
    const submissions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Check if IP is already in submissions
    const alreadySubmitted = submissions.some(submission => submission.ip === ip);

    if (alreadySubmitted) {
      return res.status(400).json({ message: 'You have already answered the quiz.' });
    }

    // Save new submission
    submissions.push({ ...req.body, ip });
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));

    res.status(200).json({ message: 'Success' });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
