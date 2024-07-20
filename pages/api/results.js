import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'submissions.json');
  
  try {
    const submissions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.status(200).json({ submissions });
  } catch (error) {
    res.status(500).json({ error: 'Error reading submissions file' });
  }
}
