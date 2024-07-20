import { sql } from '@vercel/postgres';

const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};


export default async function handler(req, res) {
  try {
    const data = await sql`SELECT * FROM submissions`;
    const submissions = data.rows;
    const ip = getClientIp(req);
    const alreadySubmitted = submissions.some(submission => submission.ip === ip);

  if (alreadySubmitted) {
    res.status(200).json({ ok: false, message: 'Already submitted'});
  } else {
    res.status(200).json({ ok: true, message: 'Not found',});
  }
    // res.status(200).json({ submissions, ip });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ message: 'Not foundddd'});
    }
    res.status(500).json({ error: 'Error reading submissions file' });
  }
}
