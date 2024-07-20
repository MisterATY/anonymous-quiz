// pages/api/check.js
import fs from 'fs';
import path from 'path';

const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

export default function handler(req, res) {
  const ip = getClientIp(req);
  const filePath = path.join(process.cwd(), 'data', 'submissions.json');
  const submissions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const alreadySubmitted = submissions.some(submission => submission.ip === ip);

  if (alreadySubmitted) {
    res.status(200).json({ message: 'Already submitted' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}
