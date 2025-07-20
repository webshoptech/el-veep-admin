'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../api_/login';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { SubmitButton } from '../components/commons/SubmitButton';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const result = await login(formData);
      document.cookie = `token=${result.token}; path=/; max-age=86400; Secure; SameSite=Strict`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(result.data))}; path=/; max-age=86400; Secure; SameSite=Strict`;

      toast.success('Login successful');
      router.push('/');
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/login.png')" }}></div>

      <div className="w-1/2 flex flex-col justify-center items-center px-8">
        <Image width={200} height={200} src="/logo.png" alt="Logo" className="mb-10" />

        <h1 className="text-2xl font-bold mb-6">Administration</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Business Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email Address"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
            <div className="text-right mt-1">
              <a href="#" className="text-sm text-orange-500 hover:underline">Forgot Password?</a>
            </div>
          </div>

          <SubmitButton label="Log in" loading={loading} />
        </form>
      </div>
    </div>
  );
}
