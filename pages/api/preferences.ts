// /pages/api/preferences.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // TODO: Load current user's preferences
    res.status(200).json({ message: 'Load user preferences' });
  } else if (req.method === 'PUT') {
    // TODO: Upsert preferences record
    res.status(200).json({ message: 'Upsert user preferences' });
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
