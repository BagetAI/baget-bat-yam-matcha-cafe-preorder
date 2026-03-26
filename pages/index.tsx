import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    product: 'Matcha Latte',
    quantity: 1,
    subscribe: false,
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error || 'Failed to submit order');
      }

      setStatus('success');
      setFormData({ ...formData, name: '', email: '', quantity: 1, subscribe: false });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-800">Bat Yam Matcha Café Pre-Order & Subscription</h1>
      <p className="mb-6 text-green-700">Order your favorite matcha drinks and pastries in advance! Join our subscription for exclusive offers.</p>

      {status === 'success' && <p className="mb-4 text-green-600 font-semibold">Thank you! Your order has been received.</p>}
      {status === 'error' && <p className="mb-4 text-red-600 font-semibold">Error: {errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium text-green-800">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium text-green-800">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="product" className="block font-medium text-green-800">Select Product</label>
          <select
            id="product"
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="border rounded w-full p-2"
          >
            <option value="Matcha Latte">Matcha Latte</option>
            <option value="Iced Matcha">Iced Matcha</option>
            <option value="Matcha Pastry">Matcha Pastry</option>
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block font-medium text-green-800">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min={1}
            max={10}
            value={formData.quantity}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="subscribe"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="subscribe" className="text-green-800">Subscribe to newsletter for updates and special offers</label>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-green-700 text-white py-2 px-4 rounded w-full hover:bg-green-800 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting...' : 'Place Order'}
        </button>
      </form>
    </main>
  );
}
