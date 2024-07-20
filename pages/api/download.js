import { promises as fs } from 'fs';
import path from 'path';

const submissionsFile = path.join('/data', 'submissions.json');

export default async function handler(req, res) {
  try {
    const data = await fs.readFile(submissionsFile);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.json');
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: 'Error reading submissions file' });
  }
}
