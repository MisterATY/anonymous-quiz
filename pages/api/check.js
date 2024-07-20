import { promises as fs } from 'fs';
import path from 'path';

const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

const submissionsFile = path.join('/tmp', 'submissions.json');

export default async function handler(req, res) {
  try {
    const data = await fs.readFile(submissionsFile, 'utf8');
    const submissions = JSON.parse(data);
    const ip = getClientIp(req);
    res.status(200).json({ submissions, ip });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(200).json({ submissions: [] });
    }
    res.status(500).json({ error: 'Error reading submissions file' });
  }
}
