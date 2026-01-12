
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Leaf, User as UserIcon, Lock, Sun, Moon, ArrowRight, ShieldAlert, ChevronDown, ShieldCheck, Truck, Palette, ShoppingBag } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, theme, toggleTheme }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError('Silakan pilih Role terlebih dahulu.');
      return;
    }

    setIsVerifying(true);

    // Simulasi Verifikasi
    setTimeout(() => {
      if (identifier && password.length >= 4) {
        let fullName = 'Petugas Graha';
        
        // Custom name based on role for demo purposes
        switch(selectedRole) {
          case UserRole.SUPERADMIN: fullName = 'Super Admin Elite'; break;
          case UserRole.ADMIN_PACKING: fullName = 'Tim Operasional Packing'; break;
          case UserRole.ADMIN_KONTEN: fullName = 'Tim Kreatif Konten'; break;
          case UserRole.ADMIN_MARKETPLACE: fullName = 'Admin Marketplace Specialist'; break;
        }

        onLoginSuccess({
          id: Math.random().toString(36).substr(2, 9),
          username: identifier,
          email: `${identifier}@grahaorganik.com`,
          role: selectedRole as UserRole,
          fullName: fullName,
        });
      } else {
        setError('Kredensial tidak valid (Minimal 4 karakter).');
        setIsVerifying(false);
      }
    }, 1500);
  };

  const roleOptions = [
    { value: UserRole.SUPERADMIN, label: 'Super Admin', icon: <ShieldCheck size={16} /> },
    { value: UserRole.ADMIN_PACKING, label: 'Admin Packing', icon: <Truck size={16} /> },
    { value: UserRole.ADMIN_KONTEN, label: 'Admin Konten', icon: <Palette size={16} /> },
    { value: UserRole.ADMIN_MARKETPLACE, label: 'Admin Marketplace', icon: <ShoppingBag size={16} /> },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 z-0 premium-bg-radial animate-bg-flow"></div>
      
      {/* Animated Floating Blobs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-organic-500/10 dark:bg-organic-500/5 blur-[100px] rounded-full animate-float-premium"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-emerald-600/15 dark:bg-emerald-600/10 blur-[100px] rounded-full animate-float-premium" style={{ animationDelay: '-10s' }}></div>

      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-[60] p-4 rounded-full bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl border border-white/30 dark:border-slate-800/30 hover:scale-110 transition-all shadow-xl group"
      >
        {theme === 'light' ? <Moon size={24} className="text-slate-600 group-hover:text-organic-600" /> : <Sun size={24} className="text-amber-400 group-hover:text-amber-300" />}
      </button>

      <div className="relative z-20 w-full max-w-md premium-glass rounded-[3rem] p-8 md:p-12 shadow-[0_30px_60px_-12px_rgba(34,197,94,0.2)] dark:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] animate-card-entry transition-transform duration-500">
        <header className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-organic-500 via-organic-600 to-organic-700 rounded-full flex items-center justify-center shadow-2xl mb-6 transition-all duration-500 hover:rotate-[15deg] hover:scale-110">
            <Leaf size={40} className="text-white drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 uppercase leading-tight">
            <span className="text-organic-600">Graha</span> <span className="text-indonesia">Indonesia</span> <span className="text-organic-600">Organik</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-[0.4em] uppercase mt-3">Elite Management Access</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Username */}
          <div className="space-y-2 group">
            <label className="text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400 font-bold ml-1">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-organic-500 transition-colors">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="elegant-input w-full bg-white/80 dark:bg-slate-800/80 border-2 border-organic-500/20 dark:border-organic-500/30 rounded-2xl py-4 pl-12 pr-6 text-slate-800 dark:text-white text-sm font-medium outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Masukkan ID Anda"
                required
              />
            </div>
          </div>

          {/* 2. Password */}
          <div className="space-y-2 group">
            <label className="text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400 font-bold ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-organic-500 transition-colors">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="elegant-input w-full bg-white/80 dark:bg-slate-800/80 border-2 border-organic-500/20 dark:border-organic-500/30 rounded-2xl py-4 pl-12 pr-14 text-slate-800 dark:text-white text-sm outline-none"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400 hover:text-organic-600 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 3. Role Selection (Sekarang di bawah Password) */}
          <div className="space-y-2 group">
            <label className="text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400 font-bold ml-1">Pilih Jabatan (Role)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-organic-500 transition-colors pointer-events-none">
                <ShieldCheck size={18} />
              </span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="elegant-input w-full bg-white/80 dark:bg-slate-800/80 border-2 border-organic-500/20 dark:border-organic-500/30 rounded-2xl py-4 pl-12 pr-10 text-slate-800 dark:text-white text-sm font-bold outline-none appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="dark:bg-slate-900 font-normal">Pilih Role Akses</option>
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value} className="dark:bg-slate-900 font-bold py-2">
                    {role.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400 pointer-events-none">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase flex items-center space-x-2 animate-bounce">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="group relative w-full h-16 bg-gradient-to-r from-organic-500 via-organic-600 to-organic-700 hover:scale-[1.02] active:scale-[0.98] rounded-2xl text-white font-bold tracking-[0.2em] text-xs uppercase shadow-[0_12px_35px_rgba(34,197,94,0.4)] transition-all overflow-hidden"
          >
            {isVerifying ? <Loader2 className="animate-spin mx-auto" size={24} /> : (
              <div className="flex items-center justify-center space-x-2">
                <span>Akses Sistem</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
