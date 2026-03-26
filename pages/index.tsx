import React, { useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form validation schema using Zod
const preOrderSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  product: z.enum(['Matcha Latte', 'Iced Matcha', 'Matcha Pastry']),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  subscribe: z.boolean().optional(),
});

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(preOrderSchema),
    defaultValues: {
      name: '',
      email: '',
      product: 'Matcha Latte',
      quantity: 1,
      subscribe: false,
    },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit order');
      setSubmitted(true);
      reset();
    } catch (error) {
      alert('Error submitting order, please try again.');
    }
  }

  return (
    <>
      <Head>
        <title>Bat Yam Matcha Café - Pre-Order & Subscription</title>
        <meta name="description" content="Pre-order your favorite matcha drinks and pastries or subscribe for special perks from Bat Yam Matcha Café." />
      </Head>
      <main className="max-w-3xl mx-auto p-6 font-sans">
        <h1 className="text-4xl font-bold mb-4 text-center text-green-800">Bat Yam Matcha Café</h1>
        <p className="text-center text-lg mb-8">Be the first to pre-order our specialty matcha drinks and pastries, or subscribe for exclusive offers and events!</p>

        {submitted ? (
          <div className="bg-green-100 border border-green-300 p-6 rounded-lg text-green-800 text-center">
            <h2 className="text-xl font-semibold mb-2">Thank you for your order!</h2>
            <p>We'll contact you soon with details and shipping info.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Place Another Order
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded shadow">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">Name</label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="border rounded w-full p-2"
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">Email</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="border rounded w-full p-2"
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="product" className="block mb-1 font-medium">Select Product</label>
              <select
                id="product"
                {...register('product')}
                className="border rounded w-full p-2"
              >
                <option value="Matcha Latte">Matcha Latte</option>
                <option value="Iced Matcha">Iced Matcha</option>
                <option value="Matcha Pastry">Matcha Pastry</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block mb-1 font-medium">Quantity</label>
              <input
                id="quantity"
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                className="border rounded w-full p-2"
                min={1}
              />
              {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="subscribe"
                type="checkbox"
                {...register('subscribe')}
                className="mr-2"
              />
              <label htmlFor="subscribe" className="font-medium">Subscribe to newsletter and offers</label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-700 text-white font-bold py-3 rounded hover:bg-green-800 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Place Order'}
            </button>
          </form>
        )}
      </main>
    </>
  );
}
