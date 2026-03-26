import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory store for orders and subscribers (reset on server restart)
const orders: any[] = [];
const subscribers: Set<string> = new Set();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { name, email, product, quantity, subscribe } = req.body;

    // Basic validation
    if (!name || !email || !product || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof product !== 'string') {
      return res.status(400).json({ error: 'Invalid data types' });
    }

    const quantityNum = Number(quantity);
    if (Number.isNaN(quantityNum) || quantityNum < 1 || quantityNum > 10) {
      return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
    }

    // Add order to memory store
    const order = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      name,
      email,
      product,
      quantity: quantityNum,
      subscribed: !!subscribe,
      timestamp: new Date().toISOString(),
    };

    orders.push(order);

    // Add email to subscriber list if opted in
    if (subscribe) {
      subscribers.add(email.toLowerCase());
    }

    // For demonstration, we log current state
    console.log('Received order:', order);
    console.log('Current subscribers:', Array.from(subscribers));

    // Respond success
    res.status(200).json({ message: 'Order received', orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
