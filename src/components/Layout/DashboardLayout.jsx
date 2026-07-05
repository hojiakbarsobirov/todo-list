import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, DollarSign, LogOut, Menu, ClipboardList, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const DashboardLayout = () => {
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebar_open');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  // Mobil ekranlarda sahifa o'zgarganda sidebarni avtomatik yopish
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    
    // Ilk yuklanganda tekshirish
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

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
    <div className="flex min-h-screen w-full bg-[#f8fafc] text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white overflow-x-hidden relative">
      
      {/* SIDEBAR PANEL */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 bg-white text-slate-600 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-md lg:shadow-sm border-r border-slate-200/80
          ${sidebarOpen 
            ? 'w-64 translate-x-0' 
            : 'w-64 -translate-x-full lg:w-20 lg:translate-x-0'}`}
      >
        <div>
          {/* Sarlavha va tugma joylashgan qism */}
          <div className={`h-16 flex items-center bg-white border-b border-slate-100 ${sidebarOpen ? 'justify-between px-5' : 'justify-center px-0'}`}>
            
            {sidebarOpen && (
              <span className="font-bold text-base tracking-wide text-slate-900 whitespace-nowrap animate-in fade-in duration-300">
                System Panel
              </span>
            )}
            
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              title={sidebarOpen ? "Menyuni yopish" : "Menyuni ochish"}
            >
              {/* Mobil va Desktop uchun X va Menu tugmalari almashinuvi */}
              {sidebarOpen ? (
                <>
                  <X size={18} className="lg:hidden" />
                  <Menu size={18} className="hidden lg:block" />
                </>
              ) : (
                <Menu size={18} className="block" />
              )}
            </button>
          </div>

          {/* Menyu Navigatsiyasi */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isShowText = sidebarOpen;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={!sidebarOpen ? item.name : undefined}
                  className={`flex items-center rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 py-3 cursor-pointer
                    ${isShowText ? 'gap-3 px-4' : 'justify-center px-0 lg:w-12 lg:mx-auto'}
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15 font-semibold' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </div>
                  {isShowText && (
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

      {/* MOBIL OVERLAY (Z-index va ochiqlik holati to'g'rilandi) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px] z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ASOSIY KONTENT USTUNI (Paddinglar dinamik va moslashuvchan qilindi) */}
      <div 
        className={`flex-1 flex flex-col min-w-0 w-full min-h-screen transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}
      >
        {/* Navbar (Header) */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 w-full">
          <div className="flex items-center gap-3">
            {/* Mobil menyu tugmasi (Faqat sidebar yopiq turganda ko'rinadi) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-50 active:scale-95 transition-all lg:hidden cursor-pointer"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center text-[11px] sm:text-xs font-medium text-slate-400 tracking-wide select-none truncate">
              <span>Boshqaruv</span>
              <span className="mx-1.5 sm:mx-2 text-slate-300">/</span>
              <span className="text-slate-600 font-semibold truncate">{pageTitle}</span>
            </div>
          </div>
        </header>

        {/* Ishchi maydon kontenti (Kichik ekranlarda padding kamaytirildi) */}
        <main className="p-4 sm:p-6 w-full flex-grow overflow-x-hidden">
          <div className="w-full h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;