import React, { useEffect, useState } from 'react';
import { ClipboardList, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config.js'; // Firebase konfiguratsiya faylingiz yo'li
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import moment from 'moment';

const GeneralDashboard = () => {
  const [taskCount, setTaskCount] = useState(0);
  const [partsCount, setPartsCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Vazifalar sonini real vaqtda olish
    const tasksQuery = collection(db, "tasks");
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      setTaskCount(snapshot.size); // Jami hujjatlar soni
    }, (error) => {
      console.error("Vazifalarni olishda xatolik:", error);
    });

    // 2. Zapchastlar (ehtiyot qismlar) sonini real vaqtda olish
    // Eslatma: Agar kolleksiyangiz nomi boshqacha bo'lsa, "parts" ni o'zgartiring
    const partsQuery = collection(db, "parts");
    const unsubscribeParts = onSnapshot(partsQuery, (snapshot) => {
      setPartsCount(snapshot.size);
    }, (error) => {
      // Agar 'parts' kolleksiyasi hali ochilmagan bo'lsa, xatolik konsolga chiqadi, lekin dastur buzilmaydi (0 bo'lib turaveradi)
      console.log("Parts kolleksiyasi topilmadi yoki ruxsat yo'q. Qiymat: 0");
    });

    // 3. So'nggi faolliklarni olish (Oxirgi qo'shilgan 3 ta vazifa misolida)
    const recentTasksQuery = query(collection(db, "tasks"), orderBy("createdAt", "desc"), limit(3));
    const unsubscribeRecent = onSnapshot(recentTasksQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        time: doc.data().createdAt?.toDate() ? moment(doc.data().createdAt.toDate()).fromNow() : 'Hozirgincha'
      }));
      setRecentActivities(activities);
      setLoading(false);
    }, (error) => {
      console.error("So'nggi faollikni olishda xatolik:", error);
      setLoading(false);
    });

    // Subscriptions-ni tozalash (Unmount bo'lganda xotirani tejash)
    return () => {
      unsubscribeTasks();
      unsubscribeParts();
      unsubscribeRecent();
    };
  }, []);

  // Agar sahifa birinchi marta yuklanayotgan bo'lsa, chiroyli spinner ko'rsatiladi
  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <span className="text-sm font-medium">Statistika yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  // Dinamik ma'lumotlar bilan boyitilgan kartalar struktursi
  const stats = [
    {
      title: 'Jami Vazifalar',
      value: `${taskCount} ta`,
      subtitle: taskCount > 0 ? 'Workbook bazasida mavjud' : 'Hozircha vazifalar kiritilmagan',
      icon: <ClipboardList className="text-blue-600" size={22} />,
      bgIcon: 'bg-blue-50',
      trend: taskCount > 0 ? 'Faol ma\'lumot' : 'Ma\'lumot yo\'q',
      trendUp: true,
      link: '/home/tasks'
    },
    {
      title: 'Zapchastlar Bazasi',
      value: `${partsCount} turdagi`,
      subtitle: partsCount > 0 ? 'Narxlar ro\'yxati shakllangan' : 'Ehtiyot qismlar kiritilmagan',
      icon: <DollarSign className="text-emerald-600" size={22} />,
      bgIcon: 'bg-emerald-50',
      trend: partsCount > 0 ? 'Yangilangan' : '0 ta pozitsiya',
      trendUp: partsCount > 0,
      link: '/home/prices'
    },
    {
      title: 'Tizim Samaradorligi',
      value: '100%',
      subtitle: 'Cloud Firebase aloqasi',
      icon: <TrendingUp className="text-indigo-600" size={22} />,
      bgIcon: 'bg-indigo-50',
      trend: 'Onlayn',
      trendUp: true,
      link: '#'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sahifa sarlavhasi */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tizim Statistikasi</h1>
        <p className="text-sm text-slate-500 mt-1">
          Xush kelibsiz! Tizimdagi umumiy ko'rsatkichlar va operatsiyalar holati (Realtime).
        </p>
      </div>

      {/* Grid Statistika Kartalari */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`w-10 h-10 ${stat.bgIcon} rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className={`text-xs font-medium flex items-center gap-1 ${stat.trendUp ? 'text-emerald-600' : 'text-slate-400'}`}>
                <ArrowUpRight size={14} />
                {stat.trend}
              </span>
              
              {stat.link !== '#' && (
                <Link 
                  to={stat.link} 
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors"
                >
                  Batafsil
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tezkor Havolalar va Qisqa Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dinamik So'nggi Faollik paneli */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">So'nggi Faollik (Yangi vazifalar)</h3>
          {recentActivities.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Hozircha faollik mavjud emas.</p>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3 items-start text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-800">Yangi havola qo'shildi: "{act.title}"</p>
                    <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tezkor O'tish Paneli */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Tezkor O'tish</h3>
            <p className="text-xs text-slate-400 mb-4">Kerakli bo'limni tezkor ishga tushiring.</p>
          </div>
          <div className="space-y-2">
            <Link 
              to="/home/tasks" 
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
            >
              <span>Jadvalni ochish (Workbook)</span>
              <ArrowUpRight size={14} className="text-slate-400" />
            </Link>
            <Link 
              to="/home/prices" 
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
            >
              <span>Narxlarni ko'rish</span>
              <ArrowUpRight size={14} className="text-slate-400" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GeneralDashboard;