import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Mail, Phone, Briefcase, Shield, Calendar } from 'lucide-react';

interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  created_at: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('admin_profiles')
      .select('*')
      .maybeSingle();

    if (data) setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-slate-400 text-xl">No profile found</div>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-900/40 text-red-300 border-red-500',
      manager: 'bg-blue-900/40 text-blue-300 border-blue-500',
      viewer: 'bg-green-900/40 text-green-300 border-green-500',
    };
    return styles[role as keyof typeof styles] || styles.viewer;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-slate-600 rounded-full flex items-center justify-center">
            <User className="text-slate-300" size={48} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{profile.full_name}</h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadge(
                profile.role
              )}`}
            >
              <Shield size={14} className="mr-1" />
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="text-blue-400 mt-1" size={20} />
              <div>
                <p className="text-slate-400 text-sm">Email Address</p>
                <p className="text-white">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="text-green-400 mt-1" size={20} />
              <div>
                <p className="text-slate-400 text-sm">Phone Number</p>
                <p className="text-white">{profile.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Professional Details</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Briefcase className="text-yellow-400 mt-1" size={20} />
              <div>
                <p className="text-slate-400 text-sm">Department</p>
                <p className="text-white">{profile.department || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="text-purple-400 mt-1" size={20} />
              <div>
                <p className="text-slate-400 text-sm">Member Since</p>
                <p className="text-white">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Role Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300">View Dashboard</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300">Access Reports</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg">
            <div
              className={`w-2 h-2 rounded-full ${
                profile.role === 'admin' || profile.role === 'manager'
                  ? 'bg-green-400'
                  : 'bg-slate-600'
              }`}
            ></div>
            <span className="text-slate-300">Manage Inventory</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg">
            <div
              className={`w-2 h-2 rounded-full ${
                profile.role === 'admin' ? 'bg-green-400' : 'bg-slate-600'
              }`}
            ></div>
            <span className="text-slate-300">Admin Settings</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300">Camera Access</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg">
            <div
              className={`w-2 h-2 rounded-full ${
                profile.role === 'admin' || profile.role === 'manager'
                  ? 'bg-green-400'
                  : 'bg-slate-600'
              }`}
            ></div>
            <span className="text-slate-300">Generate Reports</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Activity Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-400 mb-1">127</p>
            <p className="text-slate-400 text-sm">Reports Generated</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-400 mb-1">43</p>
            <p className="text-slate-400 text-sm">Optimizations Applied</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400 mb-1">892</p>
            <p className="text-slate-400 text-sm">Total Actions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
