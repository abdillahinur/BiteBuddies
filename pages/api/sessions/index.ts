// /pages/api/sessions/index.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // TODO: Create a new group session
    res.status(201).json({ message: 'Session created' });
  } else if (req.method === 'GET') {
    // TODO: List sessions you’re in
    res.status(200).json({ message: 'List sessions' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
