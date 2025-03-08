'use client'

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface AdminStats {
  total_users: number;
  total_generations: number;
  total_tokens_used: number;
  premium_users: number;
  free_users: number;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  raw_user_meta_data: any;
  account_tier: string;
  total_generations: number;
  tokens_remaining: number;
  tokens_used: number;
}

interface Generation {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  confidence_score: number;
  processing_time: number;
  tokens_used: number;
  created_at: string;
  user: {
    email: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'generations'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  
  const supabase = createClient();

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchGenerations();
    }
  }, [activeTab, page, searchTerm]);

  async function fetchAdminData() {
    try {
      // Get stats from the admin_statistics view
      const { data: statsData } = await supabase
        .from('admin_statistics')
        .select('*')
        .single();

      if (statsData) {
        setStats(statsData);
      }

      await fetchUsers();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  }

  async function fetchUsers() {
    try {
      let query = supabase
        .from('users')  // Using the public.users view
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('email', `%${searchTerm}%`);
      }

      const { data, count } = await query
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (data) {
        setUsers(data as User[]);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async function fetchGenerations() {
    try {
      let query = supabase
        .from('generations')
        .select(`
          id,
          user_id,
          image_url,
          caption,
          confidence_score,
          processing_time,
          tokens_used,
          created_at,
          user:users!inner (
            email
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('caption', `%${searchTerm}%`);
      }

      const { data, count } = await query
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (data) {
        setGenerations(data as Generation[]);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching generations:', error);
    }
  }

  if (loading) {
    return <div className="min-h-screen pt-20 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6"
        >
          {[
            { label: 'Total Users', value: stats?.total_users ?? 0 },
            { label: 'Premium Users', value: stats?.premium_users ?? 0 },
            { label: 'Free Users', value: stats?.free_users ?? 0 },
            { label: 'Total Generations', value: stats?.total_generations ?? 0 },
            { label: 'Tokens Used', value: stats?.total_tokens_used ?? 0 },
          ].map((stat, index) => (
            <div key={index} className="bg-black/30 p-6 rounded-xl backdrop-blur-xl border border-gray-800">
              <h3 className="text-gray-400 text-sm">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/30 p-6 rounded-xl backdrop-blur-xl border border-gray-800"
        >
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setActiveTab('users');
                  setPage(1);
                  setSearchTerm('');
                }}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'users'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => {
                  setActiveTab('generations');
                  setPage(1);
                  setSearchTerm('');
                }}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'generations'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Generations
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tables */}
          <div className="overflow-x-auto">
            {activeTab === 'users' ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="p-4">Email</th>
                    <th className="p-4">Account Tier</th>
                    <th className="p-4">Total Generations</th>
                    <th className="p-4">Tokens Used</th>
                    <th className="p-4">Tokens Remaining</th>
                    <th className="p-4">Last Sign In</th>
                    <th className="p-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800">
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.account_tier === 'premium'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.account_tier || 'free'}
                        </span>
                      </td>
                      <td className="p-4">{user.total_generations}</td>
                      <td className="p-4">{user.tokens_used}</td>
                      <td className="p-4">{user.tokens_remaining}</td>
                      <td className="p-4 text-gray-400">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="p-4">Image</th>
                    <th className="p-4">Caption</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Confidence</th>
                    <th className="p-4">Processing Time</th>
                    <th className="p-4">Tokens</th>
                    <th className="p-4">Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {generations.map((gen) => (
                    <tr key={gen.id} className="border-b border-gray-800">
                      <td className="p-4">
                        <img
                          src={gen.image_url}
                          alt="Generated"
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-4">
                        <p className="line-clamp-2">{gen.caption}</p>
                      </td>
                      <td className="p-4">{gen.user?.email}</td>
                      <td className="p-4">
                        {(gen.confidence_score * 100).toFixed(1)}%
                      </td>
                      <td className="p-4">
                        {gen.processing_time.toFixed(2)}s
                      </td>
                      <td className="p-4">{gen.tokens_used}</td>
                      <td className="p-4 text-gray-400">
                        {new Date(gen.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm bg-gray-800 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {page} of {Math.ceil(totalCount / itemsPerPage)}
              {' '}({totalCount} total)
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(totalCount / itemsPerPage)}
              className="px-4 py-2 text-sm bg-gray-800 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}