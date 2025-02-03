'use client'

import { motion } from 'framer-motion';
import { useState } from 'react';


export default function AppPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCaption = async () => {
    if (!imageUrl) return;
    setLoading(true);
    try {
      // TODO: Implement the API call to generate caption
      // const response = await fetch('/api/generate-caption', ...);
      // const data = await response.json();
      // setCaption(data.caption);
      setCaption('Example caption - API integration pending');
    } catch (error) {
      console.error('Error generating caption:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/30 p-8 rounded-2xl backdrop-blur-xl border border-gray-800"
        >
          <h2 className="text-2xl font-semibold mb-6">Generate Image Caption</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter image URL or upload an image"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button 
              onClick={generateCaption}
              disabled={loading || !imageUrl}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Caption'}
            </button>
          </div>

          {caption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white/5 rounded-lg"
            >
              <p className="text-lg">{caption}</p>
            </motion.div>
          )}
        </motion.div>

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 rounded-lg overflow-hidden"
          >
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-auto max-h-[500px] object-contain bg-black/50"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
