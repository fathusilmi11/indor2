
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, AttendanceRecord, AttendanceStatus } from '../types';
import { 
  LayoutDashboard, LogOut, Package, ShoppingCart, 
  Settings, Users, Moon, Sun, Bell, Search, 
  TrendingUp, ChevronRight, Menu, X, Leaf, 
  ArrowUpRight, Clock, PlusCircle, Truck, 
  Image as ImageIcon, Share2, MessageCircle, BarChart3,
  Globe, Zap, Calendar, UserCheck, Timer, AlertCircle, CheckCircle2, ShieldAlert,
  // Fix: Added missing ShieldCheck import
  ShieldCheck,
  Lock,
  Eye,
  CreditCard
} from 'lucide-react';

interface DashboardPageProps {
  user: User | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, theme, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Ringkasan');
  const [currentStatus, setCurrentStatus] = useState<AttendanceStatus | 'BELUM_ABSEN'>('BELUM_ABSEN');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  if (!user) return null;

  const sidebarItems = useMemo(() => {
    const baseItems = [
      { id: 'Ringkasan', label: 'Ringkasan', icon: <LayoutDashboard size={20} /> },
      { id: 'Absensi', label: 'Absensi', icon: <Calendar size={20} /> },
    ];

    switch (user.role) {
      case UserRole.SUPERADMIN:
        return [
          ...baseItems,
          { id: 'Inventaris', label: 'Inventaris Stok', icon: <Package size={20} /> },
          { id: 'Pesanan', label: 'Daftar Pesanan', icon: <ShoppingCart size={20} /> },
          { id: 'Tim', label: 'Tim Internal', icon: <Users size={20} /> },
          { id: 'Laporan', label: 'Laporan Keuangan', icon: <BarChart3 size={20} /> },
          { id: 'Pengaturan', label: 'Pengaturan', icon: <Settings size={20} /> },
        ];
      case UserRole.ADMIN_PACKING:
        return [
          ...baseItems,
          { id: 'Antrean', label: 'Antrean Packing', icon: <Truck size={20} /> },
          { id: 'Stok', label: 'Stok Kemasan', icon: <Package size={20} /> },
        ];
      case UserRole.ADMIN_KONTEN:
        return [
          ...baseItems,
          { id: 'Galeri', label: 'Aset Konten', icon: <ImageIcon size={20} /> },
          { id: 'Sosmed', label: 'Social Media', icon: <Share2 size={20} /> },
        ];
      case UserRole.ADMIN_MARKETPLACE:
        return [
          ...baseItems,
          { id: 'Toko', label: 'Manajemen Toko', icon: <Globe size={20} /> },
          { id: 'Chat', label: 'Chat Pelanggan', icon: <MessageCircle size={20} /> },
        ];
      default:
        return baseItems;
    }
  }, [user.role]);

  // Guard against unauthorized tab access
  useEffect(() => {
    const isAllowed = sidebarItems.some(item => item.id === activeTab);
    if (!isAllowed) {
      setActiveTab('Ringkasan');
    }
  }, [activeTab, sidebarItems]);

  const handleCheckInGlobal = (time: string, status: AttendanceStatus) => {
    setCheckInTime(time);
    setCurrentStatus(status);
  };

  const getStatusColor = (status: AttendanceStatus | 'BELUM_ABSEN') => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-emerald-500';
      case AttendanceStatus.LATE: return 'bg-amber-500';
      case AttendanceStatus.LEAVE: return 'bg-blue-500';
      case AttendanceStatus.ABSENT: return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusLabel = (status: AttendanceStatus | 'BELUM_ABSEN') => {
    if (status === 'BELUM_ABSEN') return 'Belum Absen';
    return status;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Optimized Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex flex-col`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-10">
            <div className="bg-organic-600 p-2.5 rounded-2xl text-white shadow-lg shadow-organic-600/20">
              <Leaf size={24} />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">GRAHA</p>
              <p className="text-[10px] font-bold text-organic-600 uppercase tracking-widest mt-1">ELITE HUB</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] px-4 mb-4 flex items-center">
              <Lock size={10} className="mr-2" />
              Departemen: {user.role.split('_')[1] || 'MASTER'}
            </p>
            {sidebarItems.map((item) => (
              <SidebarItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={activeTab === item.id} 
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
              />
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-organic-600 text-white flex items-center justify-center font-black shadow-lg">
                  {user.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.fullName}</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(currentStatus)} animate-pulse`}></div>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-tighter">
                      {getStatusLabel(currentStatus)}
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-bold text-xs group">
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Selesai Sesi</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">12 Tim Aktif</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
               <div className={`w-2 h-2 rounded-full ${getStatusColor(currentStatus)}`}></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Presensi: {getStatusLabel(currentStatus)}</span>
            </div>
            <button onClick={toggleTheme} className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="flex items-center space-x-3 pl-2">
               <div className="text-right hidden sm:block">
                 <p className="text-xs font-black dark:text-white uppercase tracking-tighter">{user.fullName}</p>
                 <p className="text-[9px] text-organic-600 font-bold uppercase tracking-tight">{user.role.replace('_', ' ')}</p>
               </div>
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-organic-500 to-organic-700 border-2 border-white dark:border-slate-700 flex items-center justify-center text-white font-black shadow-lg">
                {user.fullName.charAt(0)}
               </div>
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-10 animate-fade-in max-w-[1600px] mx-auto w-full">
          {activeTab === 'Absensi' ? (
            <AttendanceView 
              user={user} 
              onCheckIn={(time, status) => handleCheckInGlobal(time, status)} 
              initialCheckIn={checkInTime}
            />
          ) : (
            <>
              <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
                    {activeTab} <span className="text-slate-400 font-light mx-2">/</span> <span className="text-organic-600">{user.role.split('_')[1] || 'ADMIN'}</span>
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Status operasional Graha dalam satu genggaman.</p>
                </div>
                
                <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                   <div className={`p-3 rounded-2xl ${currentStatus === 'BELUM_ABSEN' ? 'bg-slate-100 text-slate-400' : 'bg-organic-100 text-organic-600'}`}>
                      <UserCheck size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kehadiran Hari Ini</p>
                      <div className="flex items-center space-x-2">
                        <p className={`text-sm font-black uppercase ${currentStatus === 'BELUM_ABSEN' ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {getStatusLabel(currentStatus)}
                        </p>
                        {checkInTime && <span className="text-[10px] text-slate-400 font-bold italic">({checkInTime})</span>}
                      </div>
                   </div>
                   {currentStatus === 'BELUM_ABSEN' && (
                     <button onClick={() => setActiveTab('Absensi')} className="ml-4 p-2 bg-organic-600 text-white rounded-xl hover:bg-organic-700 transition-all">
                       <ArrowUpRight size={16} />
                     </button>
                   )}
                </div>
              </div>

              {/* Dynamic Sub-Dashboards with strict isolation */}
              {activeTab === 'Ringkasan' && (
                <>
                  {user.role === UserRole.SUPERADMIN && <SuperAdminDashboard />}
                  {user.role === UserRole.ADMIN_PACKING && <PackingAdminDashboard />}
                  {user.role === UserRole.ADMIN_KONTEN && <KontenAdminDashboard />}
                  {user.role === UserRole.ADMIN_MARKETPLACE && <MarketplaceAdminDashboard />}
                </>
              )}

              {/* Tab Content Logic for other tabs */}
              {activeTab === 'Inventaris' && user.role === UserRole.SUPERADMIN && <InventoryView />}
              {activeTab === 'Tim' && user.role === UserRole.SUPERADMIN && <TeamView />}
              {activeTab === 'Laporan' && user.role === UserRole.SUPERADMIN && <ReportsView />}
              {activeTab === 'Pengaturan' && user.role === UserRole.SUPERADMIN && <SettingsView />}
              
              {/* Fallback for unauthorized/empty states */}
              {!['Ringkasan', 'Absensi'].includes(activeTab) && (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 border border-slate-200 dark:border-slate-800 text-center">
                   <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldAlert size={32} className="text-slate-400" />
                   </div>
                   <h2 className="text-xl font-black text-slate-900 dark:text-white">Modul Dalam Pengembangan</h2>
                   <p className="text-slate-500 mt-2">Terima kasih telah menunggu. Modul ini sedang dioptimasi untuk versi Elite.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// --- ATTENDANCE COMPONENT ---

const AttendanceView = ({ user, onCheckIn, initialCheckIn }: { user: User, onCheckIn: (time: string, status: AttendanceStatus) => void, initialCheckIn: string | null }) => {
  const [time, setTime] = useState(new Date());
  const [isPresent, setIsPresent] = useState(!!initialCheckIn);
  const [checkInTime, setCheckInTime] = useState<string | null>(initialCheckIn);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    // Mock history
    setHistory([
      { id: '1', userId: user.id, userName: user.fullName, role: user.role, date: '2025-05-20', clockIn: '08:00', clockOut: '17:00', status: AttendanceStatus.PRESENT },
      { id: '2', userId: 'u2', userName: 'Siska Amelia', role: UserRole.ADMIN_KONTEN, date: '2025-05-20', clockIn: '08:45', clockOut: '17:15', status: AttendanceStatus.LATE },
      { id: '3', userId: 'u3', userName: 'Riko Pratama', role: UserRole.ADMIN_MARKETPLACE, date: '2025-05-20', clockIn: '08:05', clockOut: '17:00', status: AttendanceStatus.PRESENT },
    ]);
    return () => clearInterval(timer);
  }, [user]);

  const handleCheckInAction = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLateStatus = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 30);
    const finalStatus = isLateStatus ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
    
    setIsPresent(true);
    setCheckInTime(formattedTime);
    onCheckIn(formattedTime, finalStatus);
  };

  const isLate = time.getHours() > 8 || (time.getHours() === 8 && time.getMinutes() > 30);

  // Strictly filter history based on role: Superadmin sees all, others see only theirs
  const filteredHistory = useMemo(() => {
    if (user.role === UserRole.SUPERADMIN) return history;
    return history.filter(h => h.userId === user.id);
  }, [history, user.id, user.role]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
              <Clock size={120} />
            </div>
            
            <div className="text-center relative z-10">
              <p className="text-xs font-black text-organic-600 uppercase tracking-widest mb-2">{time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h2>
              
              {!isPresent ? (
                <button 
                  onClick={handleCheckInAction}
                  className="w-full py-5 bg-gradient-to-br from-organic-500 to-organic-700 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-lg shadow-organic-500/30 hover:scale-[1.02] transition-all flex items-center justify-center space-x-3 group"
                >
                  <Timer size={20} className="group-hover:rotate-12 transition-transform" />
                  <span>Absen Masuk Sekarang</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-3xl">
                    <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
                      <CheckCircle2 size={18} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Sesi Aktif</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">Masuk: {checkInTime}</p>
                  </div>
                  <button className="w-full py-5 bg-white dark:bg-slate-800 text-red-500 border-2 border-red-50 dark:border-red-900/20 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-red-50 transition-all">
                    Absen Pulang
                  </button>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-center space-x-6">
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Jadwal</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">08:00 WIB</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Toleransi</p>
                  <p className="text-sm font-bold text-amber-500">30 Menit</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-3xl flex items-center space-x-4 border-2 ${isLate ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30'}`}>
            <div className={`p-3 rounded-2xl ${isLate ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-black dark:text-white uppercase tracking-tight">{isLate ? 'Status Terlambat' : 'Status Tepat Waktu'}</p>
              <p className="text-[10px] text-slate-500 font-medium">Jam kerja mulai pukul 08:00 WIB.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <UserCheck size={20} className="text-organic-600" />
                <span>{user.role === UserRole.SUPERADMIN ? 'Presensi Seluruh Tim' : 'Histori Absensi Pribadi'}</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama / Jabatan</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">In</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Out</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                            {item.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black dark:text-white uppercase tracking-tighter">{item.userName}</p>
                            <p className="text-[9px] text-slate-400 font-bold tracking-tight uppercase">{item.role.split('_')[1] || 'MASTER'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{item.date}</td>
                      <td className="py-4 text-center">
                        <span className="text-xs font-black px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{item.clockIn}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-xs font-black px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{item.clockOut || '--:--'}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                          item.status === AttendanceStatus.PRESENT 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs italic">Belum ada catatan hari ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-DASHBOARD VIEWS (Role Protected) ---

const SuperAdminDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Omzet Bulanan" value="Rp 248M" unit="+18%" up icon={<TrendingUp />} color="emerald" isPrivate />
      <StatCard label="Total Produk" value="1.240" unit="SKU" growth="+12" icon={<Package />} color="blue" />
      <StatCard label="Staff Aktif" value="48" unit="Orang" growth="Stabil" icon={<Users />} color="amber" />
      <StatCard label="Market Share" value="42%" unit="Global" growth="+2.4%" up icon={<Globe />} color="rose" isPrivate />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <h3 className="font-black text-slate-900 dark:text-white mb-6 flex items-center justify-between">
          <span>Performa Keuangan</span>
          <BarChart3 size={18} className="text-organic-600" />
        </h3>
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
          <TrendingUp size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Visualisasi Grafik Master</p>
        </div>
      </div>
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
          <ShieldAlert size={120} />
        </div>
        <h3 className="font-black mb-6 relative z-10 flex items-center space-x-2 text-organic-500">
          <ShieldCheckIcon size={20} />
          <span>Security Alert Log</span>
        </h3>
        <div className="space-y-4 relative z-10">
          <AlertItem label="Login Superadmin Baru" time="5 menit lalu" level="LOW" />
          <AlertItem label="Export Laporan Keuangan" time="1 jam lalu" level="MID" />
          <AlertItem label="Perubahan Role Tim #902" time="3 jam lalu" level="HIGH" />
        </div>
      </div>
    </div>
  </div>
);

const PackingAdminDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard label="Antrean Packing" value="142" unit="Pesanan" growth="Prioritas" icon={<Truck />} color="rose" />
      <StatCard label="Stok Lakban/Box" value="82%" unit="Kapasitas" growth="Aman" icon={<Package />} color="blue" />
      <StatCard label="Rata-rata Packing" value="1.5" unit="Min/Box" growth="+0.2" icon={<Clock />} color="emerald" />
    </div>
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-slate-900 dark:text-white">Batch Packing Hari Ini</h3>
        <span className="bg-organic-100 text-organic-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Shift Pagi</span>
      </div>
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-organic-600 shadow-sm"><Package size={24} /></div>
              <div>
                <p className="text-sm font-black dark:text-white">ORDER #BATCH-00{i}</p>
                <p className="text-[10px] text-slate-500 font-bold">45 Resi • J&T / Sicepat</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-black text-slate-400">75% SELESAI</span>
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-organic-600 w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const KontenAdminDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard label="Post Terjadwal" value="12" unit="Konten" growth="+3 Hari" icon={<Share2 />} color="blue" />
      <StatCard label="Engagement" value="4.8%" unit="IG/TikTok" up icon={<TrendingUp />} color="emerald" />
      <StatCard label="Request Review" value="8" unit="Produk" growth="Urgent" icon={<MessageCircle />} color="amber" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden relative group cursor-pointer border-2 border-transparent hover:border-organic-500 transition-all">
          <img src={`https://picsum.photos/400/600?random=${i}`} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Asset" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
            <p className="text-white text-[10px] font-black uppercase tracking-widest">Katalog Baru #{i}</p>
            <div className="flex items-center space-x-2 mt-2">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               <span className="text-white/80 text-[8px] font-bold">SIAP UPLOAD</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MarketplaceAdminDashboard = () => (
  <div className="space-y-8">
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Shopee Sales" value="Rp 82jt" unit="Hari ini" up icon={<Globe />} color="orange" isPrivate />
      <StatCard label="Tokopedia" value="Rp 45jt" unit="Hari ini" up icon={<Globe />} color="emerald" isPrivate />
      <StatCard label="Rating Toko" value="4.9" unit="/ 5.0" icon={<Zap />} color="amber" />
      <StatCard label="Pending Chat" value="28" unit="Baru" growth="+5" icon={<MessageCircle />} color="rose" />
    </div>
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
       <h3 className="font-black text-slate-900 dark:text-white mb-6">Integrasi Live Market</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MarketStatus store="Shopee Mall" status="Live" sales="42" />
          <MarketStatus store="Tokopedia Official" status="Online" sales="15" />
       </div>
    </div>
  </div>
);

// --- SPECIFIC VIEW COMPONENTS (Role Guarded) ---

const InventoryView = () => <PlaceholderView title="Inventaris Stok Global" icon={<Package size={40} />} />;
const TeamView = () => <PlaceholderView title="Manajemen Tim Internal" icon={<Users size={40} />} />;
const ReportsView = () => <PlaceholderView title="Laporan Keuangan Strategis" icon={<BarChart3 size={40} />} />;
const SettingsView = () => <PlaceholderView title="Konfigurasi Sistem" icon={<Settings size={40} />} />;

// --- HELPER COMPONENTS ---

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group relative ${active ? 'bg-organic-600 text-white shadow-lg shadow-organic-600/30 font-bold scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:pl-6'}`}>
    <div className="flex items-center space-x-3">
      <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-organic-600'}`}>{icon}</span>
      <span className="text-sm font-black tracking-tight uppercase">{label}</span>
    </div>
    {active && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
  </button>
);

const StatCard: React.FC<{ label: string; value: string; unit: string; growth?: string; up?: boolean; icon: React.ReactNode; color: string; isPrivate?: boolean }> = ({ label, value, unit, growth, up, icon, color, isPrivate }) => {
  const [showValue, setShowValue] = useState(!isPrivate);
  const colorMap: any = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20',
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>{icon}</div>
        <div className="flex items-center space-x-2">
          {isPrivate && (
            <button onClick={() => setShowValue(!showValue)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-organic-600">
               {showValue ? <Eye size={12} /> : <Lock size={12} />}
            </button>
          )}
          {growth && <div className={`text-[9px] font-black px-2 py-1 rounded-lg ${up ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{growth}</div>}
        </div>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline space-x-1">
        {showValue ? (
          <span className="text-2xl font-black dark:text-white tracking-tighter">{value}</span>
        ) : (
          <span className="text-2xl font-black text-slate-300 dark:text-slate-700 tracking-tighter italic select-none">••••••</span>
        )}
        <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
      </div>
    </div>
  );
};

const PlaceholderView = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 border border-slate-200 dark:border-slate-800 text-center animate-card-entry">
     <div className="w-24 h-24 bg-organic-50 dark:bg-organic-950/20 rounded-full flex items-center justify-center mx-auto mb-8 text-organic-600 shadow-inner">
        {icon}
     </div>
     <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
     <p className="text-slate-500 mt-3 max-w-md mx-auto font-medium">Informasi strategis sedang diproses. Modul ini dienkripsi dan hanya dapat diakses oleh personil yang berwenang.</p>
     <div className="mt-8 flex justify-center space-x-4">
        <button className="px-6 py-3 bg-organic-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-organic-600/30">Refresh Data</button>
        <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest">Akses Audit</button>
     </div>
  </div>
);

const AlertItem = ({ label, time, level }: { label: string, time: string, level: 'LOW' | 'MID' | 'HIGH' }) => {
  const levelColors = {
    LOW: 'bg-emerald-500',
    MID: 'bg-amber-500',
    HIGH: 'bg-rose-500'
  };
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
       <div className="flex items-center space-x-3">
          <div className={`w-1.5 h-8 rounded-full ${levelColors[level]}`}></div>
          <div>
            <p className="text-xs font-bold text-white">{label}</p>
            <p className="text-[9px] text-slate-400 font-medium italic">{time}</p>
          </div>
       </div>
       <span className="text-[8px] font-black text-slate-500 px-2 py-1 bg-white/5 rounded-md">{level}</span>
    </div>
  );
};

const MarketStatus = ({ store, status, sales }: { store: string, status: string, sales: string }) => (
  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
     <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-organic-600 shadow-sm"><Globe size={20} /></div>
        <div>
           <p className="text-xs font-black dark:text-white uppercase tracking-tighter">{store}</p>
           <div className="flex items-center space-x-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'Live' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></span>
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{status}</span>
           </div>
        </div>
     </div>
     <div className="text-right">
        <p className="text-sm font-black dark:text-white">{sales}</p>
        <p className="text-[8px] text-slate-400 font-black uppercase">Sales</p>
     </div>
  </div>
);

const ShieldCheckIcon = ({ size, className }: { size?: number, className?: string }) => <ShieldCheck size={size || 20} className={className} />;

export default DashboardPage;
