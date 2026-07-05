import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, DollarSign, LogOut, Menu, ClipboardList, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const DashboardLayout = () => {
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebar_open');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebar_open', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const menuItems = [
    { path: '/home', name: 'Dashboard', icon: <BookOpen size={18} /> },
    { path: '/home/tasks', name: 'Vazifalar (Workbook)', icon: <ClipboardList size={18} /> },
    { path: '/home/prices', name: 'Zapchast narxlari', icon: <DollarSign size={18} /> },
  ];

  const currentItem = menuItems.find(item => item.path === location.pathname);
  const pageTitle = currentItem ? currentItem.name : 'Boshqaruv';

  return (
    <div className="flex min-h-screen w-full max-w-full bg-[#f8fafc] text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* SIDEBAR PANEL */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 bg-white text-slate-600 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-sm border-r border-slate-200/80
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}`}
      >
        <div>
          {/* Logo Qismi */}
          <div className="h-16 flex items-center justify-between px-5 bg-white border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/10 flex-shrink-0 font-bold">
                💡
              </div>
              {sidebarOpen && (
                <span className="font-bold text-base tracking-wide text-slate-900 whitespace-nowrap animate-in fade-in duration-300">
                  System Panel
                </span>
              )}
            </div>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Menyu Navigatsiyasi */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={!sidebarOpen ? item.name : undefined}
                  className={`flex items-center rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 py-3 cursor-pointer
                    ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'}
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15 font-semibold' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </div>
                  {sidebarOpen && (
                    <span className="whitespace-nowrap animate-in fade-in duration-300">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profil qismi */}
        <div className={`p-4 bg-white border-t border-slate-100 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
              XS
            </div>
            {sidebarOpen && (
              <div className="flex flex-col animate-in fade-in duration-300 whitespace-nowrap">
                <span className="text-xs font-semibold text-slate-800 leading-tight">X.Sobirov</span>
                <span className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">ID: 0206</span>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <Link 
              to="/" 
              className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer" 
              title="Chiqish"
            >
              <LogOut size={16} />
            </Link>
          )}
        </div>
      </aside>

      {/* MOBIL OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-[1px] z-20 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ASOSIY KONTENT USTUNI (Layout tuzatilgan qismi) */}
      <div 
        className={`flex-1 flex flex-col min-w-0 w-full max-w-full transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}
      >
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 w-full">
          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center text-xs font-medium text-slate-400 tracking-wide select-none">
              <span>Boshqaruv</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-600 font-semibold">{pageTitle}</span>
            </div>
          </div>
        </header>

        {/* Ishchi maydon kontenti */}
        <main className="p-6 w-full max-w-full flex-grow overflow-x-hidden">
          <div className="w-full max-w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;