import React, { useState, useEffect } from 'react';
import { 
  Home, User, Plus, Target, Clock,
  Upload, Download, Edit2, CheckCircle, 
  XCircle, Image as ImageIcon, Camera, TrendingUp,
  ChevronRight, LogOut, ShieldCheck, Bell,
  CreditCard, FileText, ArrowRightLeft, PieChart,
  DollarSign, Activity
} from 'lucide-react';

// --- Utility Functions ---
const formatDollar = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Modern PayPal Ball Logo ---
const Logo = ({ className = "w-6 h-6", white = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 20 C 25 20, 65 20, 75 40 C 85 60, 65 80, 45 80 L 35 80 L 25 20 Z" fill={white ? "#ffffff" : "#003087"} />
    <path d="M35 30 C 35 30, 75 30, 85 50 C 95 70, 75 90, 55 90 L 45 90 L 35 30 Z" fill={white ? "#E6F0FF" : "#0070BA"} opacity="0.9" />
    <circle cx="65" cy="65" r="12" fill={white ? "#ffffff" : "#ffffff"} />
    <path d="M65 53 A 12 12 0 0 0 53 65 A 12 12 0 0 0 65 77 A 12 12 0 0 0 77 65 A 12 12 0 0 0 65 53 Z" stroke={white ? "#0070BA" : "#003087"} strokeWidth="2" />
    <path d="M65 59 L 61 62 L 61 68 L 65 71 L 69 68 L 69 62 Z" fill={white ? "#0070BA" : "#003087"} />
    <path d="M65 59 L 65 53 M 61 62 L 55 59 M 61 68 L 55 71 M 65 71 L 65 77 M 69 68 L 75 71 M 69 62 L 75 59" stroke={white ? "#0070BA" : "#003087"} strokeWidth="1.5" />
  </svg>
);

// --- Main Application Component ---
export default function App() {
  const [stage, setStage] = useState('loading'); 
  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [slideDir, setSlideDir] = useState('');

  // Initial Data State
  const [data, setData] = useState({
    profile: { name: 'Trader Pemula', bio: 'Fokus nabung Xiaomi 13', photo: null, email: '' },
    balance: 180000, 
    goal: { name: 'Xiaomi 13', target: 6.000.000 },
    accounts: [],
    transactions: [{ id: '1', type: 'add', amount: 180.000, date: new Date().toISOString(), desc: 'Initial Balance' }]
  });

  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [modals, setModals] = useState({
    addBalance: false, addAccount: false, sellAccount: null, editProfile: false
  });

  // Smooth Entry Sequence
  useEffect(() => {
    if (stage === 'loading') {
      setTimeout(() => setStage('welcome'), 2000);
    }
  }, [stage]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAuth = (e, isRegister) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (isRegister) {
      setAuthData({ email, password });
      setData(prev => ({ ...prev, profile: { ...prev.profile, email } }));
      setSlideDir('slide-left');
      setTimeout(() => { setStage('login'); setSlideDir(''); }, 300);
    } else {
      if (email === authData.email && password === authData.password) {
        setSlideDir('slide-up');
        setTimeout(() => { setStage('app'); setSlideDir(''); }, 400);
      } else {
        showToast('Email atau password salah!', 'error');
      }
    }
  };

  // --- Handlers ---
  const handleAddBalance = (amount) => {
    setData(prev => ({
      ...prev, balance: prev.balance + amount,
      transactions: [{ id: generateId(), type: 'add', amount, date: new Date().toISOString(), desc: 'Manual Top Up' }, ...prev.transactions]
    }));
    setModals({ ...modals, addBalance: false });
    showToast('Balance added successfully!');
  };

  const handleAddAccount = (accData) => {
    if (data.balance < accData.buyPrice) { showToast('Insufficient balance!', 'error'); return; }
    
    const newAcc = { ...accData, id: generateId(), status: 'active', dateAcquired: new Date().toISOString() };
    
    setData(prev => ({
      ...prev, balance: prev.balance - accData.buyPrice, accounts: [newAcc, ...prev.accounts],
      transactions: [{ id: generateId(), type: 'buy', amount: accData.buyPrice, date: new Date().toISOString(), desc: `Bought Account (${accData.epics} Epic)` }, ...prev.transactions]
    }));
    setModals({ ...modals, addAccount: false });
    showToast('Account added to inventory!');
  };

  const handleSellAccount = (id, sellPrice) => {
    setData(prev => {
      const accIndex = prev.accounts.findIndex(a => a.id === id);
      const acc = prev.accounts[accIndex];
      const updatedAccounts = [...prev.accounts];
      
      updatedAccounts[accIndex] = { ...acc, status: 'sold', sellPrice, dateSold: new Date().toISOString() };
      
      return {
        ...prev, balance: prev.balance + sellPrice, accounts: updatedAccounts,
        transactions: [{ id: generateId(), type: 'sell', amount: sellPrice, date: new Date().toISOString(), desc: `Sold Account (+${formatDollar(sellPrice - acc.buyPrice)} Profit)` }, ...prev.transactions]
      };
    });
    setModals({ ...modals, sellAccount: null });
    showToast('Account sold successfully!');
  };

  // --- Common Header Component ---
  const Header = () => (
    <div className="flex justify-between items-center px-6 pt-12 pb-4 bg-[#F5F7FA]">
      <div className="flex items-center gap-2">
         <Logo className="w-8 h-8" />
         <span className="font-bold text-gray-900 text-lg tracking-tight">PayPal Ball</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-200 text-gray-700 relative">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <img src={data.profile.photo || 'https://via.placeholder.com/40'} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-300 cursor-pointer" onClick={() => setActiveTab('profile')} />
      </div>
    </div>
  );

  // --- Renderers ---
  if (stage === 'loading' || stage === 'welcome') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-1000 font-sans ${stage === 'welcome' ? 'bg-[#0070BA]' : 'bg-white'}`}>
        <div className={`transform transition-all duration-1000 ${stage === 'welcome' ? 'scale-125 -translate-y-12' : 'scale-100'}`}>
          <Logo className="w-24 h-24 drop-shadow-xl" white={stage === 'welcome'} />
        </div>
        {stage === 'welcome' && (
          <div className="absolute bottom-16 w-full px-8 animate-fade-in-up flex flex-col items-center text-white">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>PayPal Ball</h1>
            <p className="text-blue-100 mb-12 text-center text-[17px] font-medium max-w-xs leading-relaxed">Kelola akun dan target finansialmu dengan mudah.</p>
            <button onClick={() => { setSlideDir('slide-left'); setTimeout(() => { setStage('register'); setSlideDir(''); }, 300); }} className="w-full max-w-xs bg-white text-[#0070BA] py-4 rounded-full font-bold text-lg shadow-xl active:scale-95 transition-all mb-5 hover:bg-gray-50">
              Sign Up
            </button>
            <button onClick={() => { setSlideDir('slide-left'); setTimeout(() => { setStage('login'); setSlideDir(''); }, 300); }} className="w-full max-w-xs bg-transparent text-white font-bold text-lg active:opacity-70 transition-all hover:underline underline-offset-4">
              Log In
            </button>
          </div>
        )}
      </div>
    );
  }

  if (stage === 'register' || stage === 'login') {
    const isReg = stage === 'register';
    return (
      <div className={`min-h-screen bg-white text-gray-900 flex flex-col px-8 pt-16 transition-transform duration-300 font-sans ${slideDir === 'slide-left' ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'} ${slideDir === 'slide-up' ? '-translate-y-full opacity-0' : ''}`}>
        <div className="flex justify-center mb-10"><Logo className="w-14 h-14 drop-shadow-md" /></div>
        <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-center" style={{ fontFamily: "'Inter', sans-serif" }}>{isReg ? 'Buat Akun Baru' : 'Masuk ke PayPal Ball'}</h2>
        <p className="text-center mb-12 text-gray-500 font-medium text-[15px]">Masukkan email dan password Anda.</p>
        
        <form onSubmit={(e) => handleAuth(e, isReg)} className="space-y-5 max-w-sm mx-auto w-full">
          <input required type="email" name="email" className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[#0070BA] outline-none text-lg transition-all placeholder-gray-400 font-medium" placeholder="Alamat Email" />
          <input required type="password" name="password" className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[#0070BA] outline-none text-lg transition-all placeholder-gray-400 font-medium" placeholder="Password" />
          <button type="submit" className="w-full bg-[#0070BA] text-white font-bold py-4 rounded-full shadow-lg hover:bg-[#005ea6] active:scale-95 transition-all mt-8 text-lg">
            {isReg ? 'Next' : 'Log In'}
          </button>
        </form>
        <div className="mt-10 text-center">
          <button onClick={() => setStage(isReg ? 'login' : 'register')} className="font-bold text-[#0070BA] hover:underline underline-offset-4 text-[15px]">
            {isReg ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </button>
        </div>
      </div>
    );
  }

  // --- Main App Views ---
  const renderHome = () => {
    const goalProgress = Math.min((data.balance / data.goal.target) * 100, 100);
    const activeAccounts = data.accounts.filter(a => a.status === 'active');
    const soldAccounts = data.accounts.filter(a => a.status === 'sold');
    const totalProfit = soldAccounts.reduce((sum, acc) => sum + (acc.sellPrice - acc.buyPrice), 0);

    return (
      <div className="pb-32 bg-[#F5F7FA] min-h-screen font-sans animate-fade-in">
        <Header />

        <div className="px-5 mt-2">
          <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] overflow-hidden mb-6 border border-gray-100">
            <div className="p-6 pb-8">
              <div className="flex items-center gap-2 mb-3">
                <Logo className="w-5 h-5" />
                <span className="text-[15px] font-semibold text-gray-800">PayPal Ball balance</span>
              </div>
              <h1 className="text-[44px] leading-none font-bold tracking-tight text-gray-900 mb-1">
                {formatDollar(data.balance)}
              </h1>
            </div>
            <div 
              onClick={() => setModals({ ...modals, addBalance: true })}
              className="bg-[#0070BA] p-4 px-6 text-white flex items-center justify-between cursor-pointer hover:bg-[#005ea6] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-md"><CreditCard size={20} className="text-white" /></div>
                <div>
                  <p className="font-semibold text-[15px]">Tap to add manual balance</p>
                  <p className="text-[13px] text-blue-100">Top-up for purchasing accounts</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-blue-100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between">
              <p className="text-[13px] text-gray-500 font-semibold mb-2">Total Profit</p>
              <h2 className="text-xl font-bold text-gray-900">{formatDollar(totalProfit)}</h2>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between">
              <p className="text-[13px] text-gray-500 font-semibold mb-2">Goal: {data.goal.name}</p>
              <div>
                 <h2 className="text-xl font-bold text-gray-900">{goalProgress.toFixed(0)}%</h2>
                 <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                   <div className="bg-[#0070BA] h-1.5 rounded-full" style={{ width: `${goalProgress}%` }}></div>
                 </div>
              </div>
            </div>
          </div>

          <div className="mb-2 flex justify-between items-end px-1">
            <h3 className="text-lg font-bold text-gray-900">Inventory Accounts</h3>
            <span className="text-sm font-semibold text-[#0070BA] cursor-pointer hover:underline">See all <ChevronRight size={14} className="inline -mt-0.5"/></span>
          </div>
          
          <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-5 border border-gray-100">
            {activeAccounts.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <ShieldCheck size={32} className="mx-auto mb-2 opacity-50 text-gray-300" />
                <p className="text-sm font-medium">No accounts yet.<br/>Tap the blue icon to add one.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {activeAccounts.map((acc, idx) => (
                  <div key={acc.id} className={`flex gap-4 items-center ${idx !== 0 ? 'pt-5 border-t border-gray-100' : ''}`}>
                    <div className="w-16 h-16 rounded-2xl flex-shrink-0 overflow-hidden bg-gray-100 relative border border-gray-200">
                      {acc.image ? <img src={acc.image} alt="Akun" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[15px] text-gray-900 truncate">{acc.email.split('@')[0]}</h4>
                      <p className="text-[13px] text-gray-500 truncate font-medium">{acc.epics} Epics • {acc.coins} Coins</p>
                      <p className="text-[13px] font-semibold text-[#0070BA] mt-0.5">Bought: {formatDollar(acc.buyPrice)}</p>
                    </div>
                    <button 
                      onClick={() => setModals({ ...modals, sellAccount: acc })}
                      className="bg-[#F5F7FA] text-[#0070BA] hover:bg-blue-50 text-[13px] px-4 py-2 rounded-full font-bold transition-colors"
                    >
                      Sell
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderActivity = () => (
    <div className="pb-32 bg-[#F5F7FA] min-h-screen font-sans animate-fade-in">
      <Header />
      <div className="px-5 mt-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 px-1">Activity</h1>
        <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden border border-gray-100">
          {data.transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">No activity yet.</div>
          ) : (
            data.transactions.map((trx, idx) => (
              <div key={trx.id} className={`p-5 flex justify-between items-center ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${trx.type === 'buy' ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-600'}`}>
                    {trx.type === 'buy' ? <ArrowRightLeft size={20} /> : <TrendingUp size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-gray-900">{trx.desc}</p>
                    <p className="text-[13px] text-gray-500 font-medium">{new Date(trx.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <p className={`font-bold text-[15px] ${trx.type === 'buy' ? 'text-gray-900' : 'text-green-600'}`}>
                  {trx.type === 'buy' ? '-' : '+'}{formatDollar(trx.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="pb-32 bg-[#F5F7FA] min-h-screen font-sans animate-fade-in">
      <Header />
      <div className="px-5 mt-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 px-1">Profile</h1>
        
        <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 mb-6 flex flex-col items-center text-center border border-gray-100">
          <div className="relative mb-4">
            <img src={data.profile.photo || 'https://via.placeholder.com/100'} alt="Profile" className="w-24 h-24 rounded-full object-cover bg-gray-100 border-2 border-gray-50" />
            <button onClick={() => setModals({ ...modals, editProfile: true })} className="absolute bottom-0 right-0 bg-[#0070BA] text-white p-2 rounded-full shadow-md border-2 border-white hover:bg-[#005ea6]">
              <Edit2 size={14} />
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{data.profile.name}</h2>
          <p className="text-[15px] text-gray-500 mb-4">{data.profile.email}</p>
          <span className="bg-[#F5F7FA] text-gray-700 px-5 py-2 rounded-full text-[13px] font-semibold border border-gray-100">{data.profile.bio}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden mb-6 border border-gray-100">
          <button onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            const anchor = document.createElement('a'); anchor.href = dataStr; anchor.download = "paypal_ball_backup.json";
            document.body.appendChild(anchor); anchor.click(); anchor.remove(); showToast('Backup exported!');
          }} className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#F5F7FA] rounded-full text-[#0070BA]"><Download size={20} /></div>
              <div><p className="font-bold text-[15px] text-gray-900">Export Backup</p><p className="text-[13px] text-gray-500 font-medium">Save data to device</p></div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <div className="relative border-t border-gray-100">
            <input type="file" accept=".json" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  try { setData(JSON.parse(event.target.result)); showToast('Data imported!'); } 
                  catch (err) { showToast('Invalid JSON file!', 'error'); }
                }; reader.readAsText(file);
              }
            }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#F5F7FA] rounded-full text-[#0070BA]"><Upload size={20} /></div>
                <div><p className="font-bold text-[15px] text-gray-900">Import Data</p><p className="text-[13px] text-gray-500 font-medium">Restore from JSON</p></div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
        </div>

        <button onClick={() => setStage('welcome')} className="w-full p-5 rounded-3xl bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] font-bold text-red-500 flex justify-center items-center gap-2 hover:bg-red-50 transition-colors border border-gray-100">
          <LogOut size={20} /> Log Out
        </button>
      </div>
    </div>
  );

  const renderStats = () => {
    const soldAccounts = data.accounts.filter(a => a.status === 'sold');
    const totalProfit = soldAccounts.reduce((sum, a) => sum + (a.sellPrice - a.buyPrice), 0);
    const totalRevenue = soldAccounts.reduce((sum, a) => sum + a.sellPrice, 0);
    const totalCapital = soldAccounts.reduce((sum, a) => sum + a.buyPrice, 0);

    const accountsWithHoldTime = soldAccounts.map(a => {
      const ms = new Date(a.dateSold).getTime() - new Date(a.dateAcquired).getTime();
      const days = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
      return { ...a, holdDays: days, profit: a.sellPrice - a.buyPrice };
    });

    const avgHoldDays = accountsWithHoldTime.length 
      ? (accountsWithHoldTime.reduce((sum, a) => sum + a.holdDays, 0) / accountsWithHoldTime.length).toFixed(1) 
      : 0;

    const maxHold = Math.max(...accountsWithHoldTime.map(a => a.holdDays), 5);

    return (
      <div className="pb-32 bg-[#F5F7FA] min-h-screen font-sans animate-fade-in">
        <Header />
        <div className="px-5 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 px-1">Statistics</h1>

          <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-[#0070BA] rounded-lg"><PieChart size={20} /></div>
              <h3 className="font-bold text-lg text-gray-900">Untung Rugi (P&L)</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[13px] text-gray-500 font-semibold mb-1">Total Pendapatan Jual</p>
                <p className="text-2xl font-bold text-gray-900">{formatDollar(totalRevenue)}</p>
              </div>
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <div className="flex-1">
                  <p className="text-[12px] text-gray-500 font-semibold mb-1">Modal Dikeluarkan</p>
                  <p className="text-lg font-bold text-red-500">{formatDollar(totalCapital)}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[12px] text-gray-500 font-semibold mb-1">Profit Bersih</p>
                  <p className="text-lg font-bold text-green-600">+{formatDollar(totalProfit)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Clock size={20} /></div>
                <h3 className="font-bold text-lg text-gray-900">Waktu Hold Akun</h3>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-gray-500 font-semibold">Rata-rata</p>
                <p className="text-lg font-bold text-gray-900">{avgHoldDays} Hari</p>
              </div>
            </div>

            <div className="h-32 flex items-end gap-3 justify-between border-b border-gray-100 pb-2">
              {accountsWithHoldTime.slice(-6).map((acc, idx) => {
                const height = Math.max((acc.holdDays / maxHold) * 100, 10);
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 group relative">
                    <div className="absolute -top-8 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-medium">
                      {acc.holdDays} Hari
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{acc.holdDays}d</div>
                    <div className="w-full max-w-[24px] bg-[#0070BA] rounded-t-md transition-all duration-500 hover:bg-[#005ea6]" style={{ height: `${height}%` }}></div>
                  </div>
                );
              })}
              {accountsWithHoldTime.length === 0 && <p className="w-full text-center text-sm text-gray-400 mb-10 font-medium">Belum ada data penjualan</p>}
            </div>
            <p className="text-center text-[11px] text-gray-400 mt-3 uppercase tracking-wider font-bold">Grafik 6 Akun Terakhir (Hari)</p>
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-4 px-1">History Jual Akun</h3>
          <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-5 border border-gray-100">
            {accountsWithHoldTime.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm font-medium">Belum ada akun yang terjual.</div>
            ) : (
              <div className="space-y-4">
                {accountsWithHoldTime.slice().reverse().map((acc, idx) => (
                  <div key={acc.id} className={`flex justify-between items-center ${idx !== 0 ? 'pt-4 border-t border-gray-100' : ''}`}>
                    <div>
                      <h4 className="font-bold text-[14px] text-gray-900">{acc.email.split('@')[0]}</h4>
                      <p className="text-[12px] text-gray-500 mt-0.5 font-medium">Hold: {acc.holdDays} Hari • {acc.epics} Epics</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[14px] text-green-600">+{formatDollar(acc.profit)}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Terjual {formatDollar(acc.sellPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen text-gray-900 font-sans relative overflow-hidden">
      <div className="max-w-md mx-auto h-screen relative overflow-y-auto bg-[#F5F7FA] shadow-2xl">
        
        {/* Notifications */}
        {toast && (
          <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-[14px] font-bold flex items-center gap-2 animate-fade-in-up ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'}`}>
            {toast.type === 'success' && <CheckCircle size={16} />} {toast.msg}
          </div>
        )}

        {/* Content */}
        {activeTab === 'home' && renderHome()}
        {activeTab === 'activity' && renderActivity()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'stats' && renderStats()}

        {/* Bottom Navbar */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 flex justify-between px-6 pb-safe pt-3 z-40 items-center">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'home' ? 'text-[#0070BA]' : 'text-gray-400 hover:text-gray-600'}`}>
            <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button onClick={() => setActiveTab('activity')} className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'activity' ? 'text-[#0070BA]' : 'text-gray-400 hover:text-gray-600'}`}>
            <FileText size={24} strokeWidth={activeTab === 'activity' ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Activity</span>
          </button>
          
          <div className="relative -top-6 flex justify-center w-16">
            <button 
              onClick={() => setModals({ ...modals, addAccount: true })}
              className="bg-[#0070BA] text-white p-4 rounded-full shadow-lg border-[6px] border-[#F5F7FA] active:scale-95 transition-transform flex items-center justify-center hover:bg-[#005ea6]"
            >
              <ArrowRightLeft size={24} strokeWidth={2.5} className="transform rotate-90" />
            </button>
            <span className="absolute -bottom-5 text-[10px] font-semibold text-gray-500 whitespace-nowrap">Input Akun</span>
          </div>

          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'profile' ? 'text-[#0070BA]' : 'text-gray-400 hover:text-gray-600'}`}>
            <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
          
          <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'stats' ? 'text-[#0070BA]' : 'text-gray-400 hover:text-gray-600'}`}>
            <TrendingUp size={24} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Stats</span>
          </button>
        </div>

        {/* --- Modals (Popups) --- */}
        
        {/* Add Balance Modal */}
        {modals.addBalance && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-slide-up">
              <h3 className="text-xl font-bold mb-6 text-gray-900 text-center">Add Balance</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleAddBalance(Number(e.target.amount.value)); }}>
                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-bold text-xl text-gray-500">$</span>
                  <input required type="number" name="amount" min="1" className="w-full bg-gray-50 rounded-2xl p-4 pl-10 outline-none font-bold text-3xl text-gray-900 focus:bg-gray-100 transition-colors" placeholder="0" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setModals({ ...modals, addBalance: false })} className="flex-1 py-4 rounded-full font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 rounded-full font-bold text-white bg-[#0070BA] hover:bg-[#005ea6] transition-colors">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Account Modal */}
        {modals.addAccount && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end animate-fade-in backdrop-blur-sm">
            <div className="bg-[#F5F7FA] rounded-t-3xl w-full h-[90vh] shadow-2xl animate-slide-up flex flex-col">
              <div className="sticky top-0 bg-white p-5 flex justify-between items-center z-10 rounded-t-3xl border-b border-gray-100">
                <div className="font-bold text-lg text-gray-900">Input New Account</div>
                <button onClick={() => setModals({ ...modals, addAccount: false })} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"><XCircle size={20} /></button>
              </div>
              
              <form className="overflow-y-auto p-5 pb-32 space-y-4" onSubmit={(e) => {
                e.preventDefault(); const form = e.target; const imgPreview = form.querySelector('#img-preview').src;
                handleAddAccount({
                  email: form.email.value, password: form.password.value, coins: Number(form.coins.value),
                  logins: Number(form.logins.value), gp: form.gp.value, ios: form.ios.value, epics: Number(form.epics.value),
                  buyPrice: Number(form.buyPrice.value), sellPrice: Number(form.sellPrice.value),
                  image: imgPreview.includes('placeholder') ? null : imgPreview
                });
              }}>
                <div className="bg-white p-5 rounded-3xl border border-gray-200 border-dashed flex flex-col items-center relative h-32 overflow-hidden justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <img id="img-preview" src="https://via.placeholder.com/400x200?text=+" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => {
                    const file = e.target.files[0]; if(file){ const reader = new FileReader(); reader.onloadend = () => { document.getElementById('img-preview').src = reader.result; document.getElementById('img-preview').classList.remove('opacity-10'); }; reader.readAsDataURL(file); }
                  }} />
                  <div className="relative z-0 flex flex-col items-center text-[#0070BA]"><Camera size={32} className="mb-1" /><span className="text-[13px] font-bold">Upload Image</span></div>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm space-y-3 border border-gray-100">
                  <h3 className="font-bold text-[15px] text-gray-900">Credentials</h3>
                  <input required name="email" type="email" className="w-full p-4 rounded-xl bg-gray-50 outline-none focus:bg-gray-100 font-medium" placeholder="Konami Email" />
                  <input required name="password" type="text" className="w-full p-4 rounded-xl bg-gray-50 outline-none focus:bg-gray-100 font-medium" placeholder="Password" />
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm space-y-3 border border-gray-100">
                  <h3 className="font-bold text-[15px] text-gray-900">Specs</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input required name="coins" type="number" className="w-full p-4 rounded-xl bg-gray-50 outline-none font-medium" placeholder="Coins" />
                    <input required name="logins" type="number" className="w-full p-4 rounded-xl bg-gray-50 outline-none font-medium" placeholder="Logins Left" />
                    <select name="gp" className="w-full p-4 rounded-xl bg-gray-50 outline-none text-[14px] font-medium appearance-none"><option>GP: Not Linked</option><option>GP: Linked</option></select>
                    <select name="ios" className="w-full p-4 rounded-xl bg-gray-50 outline-none text-[14px] font-medium appearance-none"><option>iOS: Not Linked</option><option>iOS: Linked</option></select>
                    <input required name="epics" type="number" className="col-span-2 w-full p-4 rounded-xl bg-gray-50 outline-none font-medium" placeholder="Total Epics/Show Time" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm space-y-3 border border-gray-100">
                  <h3 className="font-bold text-[15px] text-gray-900">Financials</h3>
                  <div className="relative"><span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-bold text-red-500">Buy $</span><input required name="buyPrice" type="number" className="w-full p-4 pl-16 rounded-xl bg-gray-50 outline-none font-bold text-red-500" placeholder="0" /></div>
                  <div className="relative"><span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-bold text-green-500">Sell $</span><input required name="sellPrice" type="number" className="w-full p-4 pl-16 rounded-xl bg-gray-50 outline-none font-bold text-green-500" placeholder="0" /></div>
                </div>

                <div className="pt-2"><button type="submit" className="w-full bg-[#0070BA] text-white font-bold py-4 rounded-full shadow-lg text-[17px] active:scale-95 transition-transform hover:bg-[#005ea6]">Save Account</button></div>
              </form>
            </div>
          </div>
        )}

        {/* Sell Account Modal */}
        {modals.sellAccount && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-slide-up text-center">
              <h3 className="text-xl font-bold mb-1 text-gray-900">Sell Account</h3>
              <p className="text-[13px] text-gray-500 mb-6 font-medium">{modals.sellAccount.email}</p>
              <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex justify-between items-center"><span className="text-[14px] text-gray-500 font-medium">Bought for</span><span className="font-bold text-gray-900">{formatDollar(modals.sellAccount.buyPrice)}</span></div>
              <form onSubmit={(e) => { e.preventDefault(); handleSellAccount(modals.sellAccount.id, Number(e.target.finalPrice.value)); }}>
                <p className="text-[13px] font-bold text-gray-500 text-left ml-2 mb-1">Final Sold Price ($)</p>
                <input required type="number" name="finalPrice" defaultValue={modals.sellAccount.sellPrice} className="w-full bg-gray-50 rounded-2xl p-4 outline-none font-bold text-2xl text-green-600 mb-6 focus:bg-gray-100 transition-colors" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setModals({ ...modals, sellAccount: null })} className="flex-1 py-4 rounded-full font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 rounded-full font-bold text-white bg-[#0070BA] hover:bg-[#005ea6] transition-colors">Confirm Sell</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {modals.editProfile && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-slide-up">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">Edit Profile</h3>
              <form onSubmit={(e) => {
                e.preventDefault(); const profPreview = e.target.querySelector('#prof-preview').src;
                setData(prev => ({ ...prev, profile: { ...prev.profile, name: e.target.p_name.value, bio: e.target.p_bio.value, photo: profPreview.includes('placeholder') ? prev.profile.photo : profPreview } }));
                setModals({ ...modals, editProfile: false }); showToast('Profile updated');
              }}>
                <div className="flex justify-center mb-6"><div className="relative"><img id="prof-preview" src={data.profile.photo || 'https://via.placeholder.com/80'} className="w-24 h-24 rounded-full object-cover bg-gray-100 border border-gray-200" alt="Prof" /><input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => { const file = e.target.files[0]; if(file){ const reader = new FileReader(); reader.onloadend = () => document.getElementById('prof-preview').src = reader.result; reader.readAsDataURL(file); } }}/><div className="absolute bottom-0 right-0 bg-[#0070BA] p-2 rounded-full text-white border-2 border-white hover:bg-[#005ea6] transition-colors"><Camera size={14}/></div></div></div>
                <input name="p_name" defaultValue={data.profile.name} className="w-full bg-gray-50 p-4 rounded-xl outline-none mb-3 focus:bg-gray-100 font-medium transition-colors" placeholder="Name" />
                <input name="p_bio" defaultValue={data.profile.bio} className="w-full bg-gray-50 p-4 rounded-xl outline-none mb-6 focus:bg-gray-100 font-medium transition-colors" placeholder="Bio" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setModals({ ...modals, editProfile: false })} className="flex-1 py-4 rounded-full font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 rounded-full font-bold text-white bg-[#0070BA] hover:bg-[#005ea6] transition-colors">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #e5e7eb; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .pb-safe { padding-bottom: calc(env(safe-area-inset-bottom) + 20px); }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}} />
    </div>
  );
}
