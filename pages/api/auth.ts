// /pages/api/auth.ts
// Proxy to Supabase Auth (signup, login, magic links)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Implement proxy logic to Supabase Auth
  res.status(501).json({ error: 'Not implemented' });
}
