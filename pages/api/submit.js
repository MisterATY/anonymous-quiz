import { promises as fs } from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

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
    // const data = await fs.readFile(submissionsFile, 'utf8');
    const data = await sql`SELECT * FROM submissions`;
    submissions = data.rows;
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
  // submissions.push({ ip, answers });
  res.status(200).json({ answers });

  try {
    // await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));
    const result = await sql`INSERT INTO submissions (ip, answers) VALUES (${ip}, ${answers});`;
    res.status(200).json({ message: 'Success', data: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Error writing submissions file' });
  }
}
