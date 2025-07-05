// /pages/api/sessions/[id]/members/[memberId].ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    // TODO: Remove a user from the session
    res.status(200).json({ message: 'User removed from session' });
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
