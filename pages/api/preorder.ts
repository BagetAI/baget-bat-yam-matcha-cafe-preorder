import { NextApiRequest, NextApiResponse } from 'next';

// In-memory storage for demo (replace with DB in production)
const orders = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, product, quantity, subscribe } = req.body;

      if (!name || !email || !product || !quantity) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Simulate saving to DB
      const order = {
        id: orders.length + 1,
        name,
        email,
        product,
        quantity,
        subscribe: !!subscribe,
        createdAt: new Date().toISOString(),
      };
      orders.push(order);

      // Here, ideally integrate email marketing API (e.g., Mailchimp) or order management system
      if (subscribe) {
        // Add email to newsletter list logic here
      }

      res.status(201).json({ message: 'Order received', orderId: order.id });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
