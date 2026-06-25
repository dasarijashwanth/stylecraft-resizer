'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@@/components/Header';
import { 
  Users, 
  Shield, 
  Trash2, 
  Search, 
  Filter, 
  UserCheck, 
  UserX,
  Mail, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Users data state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pending actions (for loading states of row items)
  const [actioningUserId, setActioningUserId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        if (res.status === 403) {
          router.push('/403');
          return;
        }
        throw new Error('Failed to load users data.');
      }
      const data = await res.ok ? await res.json() : [];
      setUsers(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not retrieve user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role?.toLowerCase() !== 'admin') {
        router.push('/403');
      } else {
        fetchUsers();
      }
    }
  }, [status, session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <RefreshCw className="w-8 h-8 text-indigo-650 animate-spin" />
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-3">Loading admin dashboard...</span>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    router.push('/login');
    return null;
  }

  // Admin Actions
  const handleUpdateRole = async (userId, currentRole) => {
    if (userId === session.user.id) {
      setErrorMsg('You cannot demote your own admin account role.');
      return;
    }

    const newRole = currentRole.toLowerCase() === 'admin' ? 'user' : 'admin';
    setActioningUserId(userId);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to update user role.');
      } else {
        setSuccessMsg(`Updated user role to ${newRole.toUpperCase()} successfully.`);
        // Update local state
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed.');
    } finally {
      setActioningUserId(null);
    }
  };

  const handleToggleVerification = async (userId, currentStatus) => {
    setActioningUserId(userId);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isVerified: !currentStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to update verification status.');
      } else {
        setSuccessMsg(`User verification status updated.`);
        setUsers(users.map(u => u.id === userId ? { ...u, isVerified: !currentStatus } : u));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed.');
    } finally {
      setActioningUserId(null);
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (userId === session.user.id) {
      setErrorMsg('You cannot delete your own admin account.');
      return;
    }

    const confirm = window.confirm(`Are you absolutely sure you want to delete the user account for ${name}? This action is irreversible.`);
    if (!confirm) return;

    setActioningUserId(userId);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to delete user.');
      } else {
        setSuccessMsg(`Successfully deleted account for ${name}.`);
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed.');
    } finally {
      setActioningUserId(null);
    }
  };

  // Stats computation
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role?.toLowerCase() === 'admin').length;
  const googleCount = users.filter(u => u.loginMethod?.toLowerCase() === 'google').length;
  const emailCount = users.filter(u => u.loginMethod?.toLowerCase() === 'email').length;
  const verifiedCount = users.filter(u => u.isVerified).length;
  const unverifiedCount = totalUsers - verifiedCount;

  // Filtered Users computation
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === 'all' || 
      user.role?.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'verified' && user.isVerified) ||
      (statusFilter === 'unverified' && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-250">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Page title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              Admin Directory <Sparkles className="w-5.5 h-5.5 text-indigo-500" />
            </h1>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-semibold">
              Inspect database user records, assign admin privileges, and manage security authentications.
            </p>
          </div>
          <button 
            onClick={fetchUsers}
            className="self-start px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl text-xs font-bold text-zinc-750 dark:text-zinc-350 cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
        </div>

        {/* Global Feedback Banners */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left animate-fadeIn">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          
          {/* Card 1: Total Users */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Total Directory</span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white mt-1.5 block">{totalUsers}</span>
              <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-550 block mt-1">Registered Accounts</span>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Admins */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Administrators</span>
              <span className="text-2xl font-black text-indigo-650 dark:text-indigo-400 mt-1.5 block">{adminCount}</span>
              <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-550 block mt-1">Full-Access Privilege</span>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Google vs Email */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Auth Channels</span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white mt-1.5 block">
                {googleCount} <span className="text-xs font-medium text-zinc-400">Google</span> / {emailCount} <span className="text-xs font-medium text-zinc-400">Email</span>
              </span>
              <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-550 block mt-1">Login Provider Breakdowns</span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-350 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Verification Status */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Verification Rate</span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white mt-1.5 block">
                {verifiedCount} <span className="text-xs font-medium text-emerald-500">Verified</span> / {unverifiedCount} <span className="text-xs font-medium text-amber-500">Pending</span>
              </span>
              <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-550 block mt-1">Email validation completions</span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-350 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Directory Filters & Controls */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center gap-4 text-left">
          
          {/* Search */}
          <div className="relative w-full md:flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user accounts by name or email address..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200 font-semibold"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter A: Role */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-1.5 pl-2 pr-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-[11px] font-bold text-zinc-650 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="user">Standard Users</option>
              </select>
            </div>

            {/* Filter B: Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 pl-2 pr-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-[11px] font-bold text-zinc-650 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Emails</option>
              <option value="unverified">Unverified Emails</option>
            </select>
          </div>

        </div>

        {/* Directory Table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden text-left">
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50/70 dark:bg-zinc-950/20 border-b border-zinc-150 dark:border-zinc-800 text-zinc-400 dark:text-zinc-550 text-[10px] font-black uppercase tracking-wider">
                  <th className="py-4 px-6 text-left font-black">User Account</th>
                  <th className="py-4 px-6 text-left font-black">Method</th>
                  <th className="py-4 px-6 text-left font-black">Role Privilege</th>
                  <th className="py-4 px-6 text-left font-black">Email Status</th>
                  <th className="py-4 px-6 text-left font-black">Created At</th>
                  <th className="py-4 px-6 text-center font-black w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/80 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 px-6 text-center text-zinc-450 dark:text-zinc-500">
                      No matching records found in the directory.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((userItem) => {
                    const isSelf = userItem.id === session.user.id;
                    const isGoogleUser = userItem.loginMethod?.toLowerCase() === 'google';
                    const isItemVerified = userItem.isVerified;
                    const itemRole = userItem.role?.toLowerCase();

                    const createdStr = userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A';

                    return (
                      <tr 
                        key={userItem.id} 
                        className={`hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors ${
                          isSelf ? 'bg-indigo-50/10 dark:bg-indigo-950/5' : ''
                        }`}
                      >
                        {/* 1. Profile cell */}
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={userItem.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userItem.name || 'user')}`}
                              alt={userItem.name}
                              className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-850 shrink-0 object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-850 dark:text-zinc-100 flex items-center gap-1.5">
                                {userItem.name}
                                {isSelf && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-350 select-none">
                                    You
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium leading-none mt-0.5">
                                {userItem.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Login Method */}
                        <td className="py-3 px-6">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            isGoogleUser 
                              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60' 
                              : 'bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/20'
                          }`}>
                            {userItem.loginMethod || 'EMAIL'}
                          </span>
                        </td>

                        {/* 3. Role switcher dropdown/badge */}
                        <td className="py-3 px-6">
                          {isSelf ? (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white flex items-center gap-1 w-max">
                              <Shield className="w-2.5 h-2.5" />
                              Admin
                            </span>
                          ) : (
                            <button
                              onClick={() => handleUpdateRole(userItem.id, userItem.role)}
                              disabled={actioningUserId === userItem.id}
                              className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border transition-all cursor-pointer select-none ${
                                itemRole === 'admin'
                                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 border-indigo-150 dark:border-indigo-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-650 dark:hover:text-zinc-350'
                                  : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-550 dark:text-zinc-400 border-zinc-200 dark:border-zinc-850 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-650 dark:hover:text-indigo-400 hover:border-indigo-150'
                              }`}
                              title="Click to toggle account role"
                            >
                              {itemRole === 'admin' && <Shield className="w-2.5 h-2.5 text-indigo-500" />}
                              {userItem.role || 'USER'}
                            </button>
                          )}
                        </td>

                        {/* 4. Verification Toggle */}
                        <td className="py-3 px-6">
                          <button
                            onClick={() => handleToggleVerification(userItem.id, isItemVerified)}
                            disabled={actioningUserId === userItem.id}
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all select-none ${
                              isItemVerified
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400'
                                : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-400'
                            }`}
                            title="Click to toggle email verification state"
                          >
                            {isItemVerified ? (
                              <>
                                <UserCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                                Verified
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3 text-amber-500 shrink-0" />
                                Pending
                              </>
                            )}
                          </button>
                        </td>

                        {/* 5. Date cell */}
                        <td className="py-3 px-6 text-zinc-450 dark:text-zinc-500 font-semibold font-mono text-[10px]">
                          {createdStr}
                        </td>

                        {/* 6. Delete cell */}
                        <td className="py-3 px-6 text-center">
                          {isSelf ? (
                            <span className="text-[10px] text-zinc-400 font-bold select-none cursor-not-allowed uppercase">
                              Active
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeleteUser(userItem.id, userItem.name)}
                              disabled={actioningUserId === userItem.id}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/15 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/35 transition-all cursor-pointer"
                              title="Delete this user account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>
    </div>
  );
}
