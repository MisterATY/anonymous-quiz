import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const params = request.query;
    const result = await sql.query(params.query);
    //   await sql`SELECT * FROM submissions;`;
    return response.status(200).json(result.rows);
  } catch (error) {
    return response.status(500).json({ error });
  }
}