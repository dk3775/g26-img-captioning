'use client'

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Session } from '@supabase/supabase-js';

export default function Home() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    checkUser();
  }, [supabase]);

  const ActionButton = () => {
    if (loading) return null;
    
    if (session) {
      return (
        <Link href="/app" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Access App
        </Link>
      );
    }
    
    return (
      <Link href="/sign-up" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition-opacity">
        Get Started
      </Link>
    );
  };

  return (
    <div className="relative">
      <section className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI-Powered Image Captioning
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Transform your images into meaningful descriptions using cutting-edge deep learning
            </p>
            <ActionButton />
          </motion.div>

          {/* Demo Section - Remove the input and generate functionality */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-black/30 p-8 rounded-2xl backdrop-blur-xl border border-gray-800"
          >
            <h2 className="text-2xl font-semibold mb-4">See it in action</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Add some demo images and their captions here */}
              <div className="rounded-lg overflow-hidden">
                <img src="/demo-1.jpg" alt="Demo" className="w-full h-48 object-cover" />
                <p className="mt-2 text-gray-300">Example caption for demo image 1</p>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img src="/demo-2.jpg" alt="Demo" className="w-full h-48 object-cover" />
                <p className="mt-2 text-gray-300">Example caption for demo image 2</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Keep this unchanged */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Advanced AI',
              description: 'Powered by state-of-the-art PyTorch models'
            },
            {
              title: 'Real-time Processing',
              description: 'Get instant captions for your images'
            },
            {
              title: 'High Accuracy',
              description: 'Trained on millions of image-caption pairs'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 bg-black/30 rounded-2xl border border-gray-800 backdrop-blur-xl"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
