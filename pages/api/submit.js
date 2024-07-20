import { promises as fs } from 'fs';
import path from 'path';

const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

const submissionsFile = path.join('/tmp', 'submissions.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const ip = getClientIp(req);

  let submissions = [];
  try {
    const data = await fs.readFile(submissionsFile, 'utf8');
    submissions = JSON.parse(data);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Error reading submissions file' });
    }
  }

  // Check if IP has already submitted
  if (submissions.some(submission => submission.ip === ip)) {
    return res.status(400).json({ message: 'You have already answered the quiz.' });
  }

  // Save new submission
  const { answers } = req.body;
  submissions.push({ ip, answers });

  try {
    await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ error: 'Error writing submissions file' });
  }
}
