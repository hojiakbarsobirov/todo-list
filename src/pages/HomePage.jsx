import { useEffect, useState } from "react";
import ModalPage from "../components/ModalPage";
import { db } from "../firebase/config.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import moment from "moment";
import { Trash2, Plus, ClipboardList, AlertTriangle, ArrowUpDown, Layers } from "lucide-react";

const HomePage = () => {
  const [modal, setModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  
  // O'chirishni tasdiqlash uchun state'lar
  const [deleteModal, setDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "tasks", taskToDelete.id));
      setDeleteModal(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="bg-[#f8fafc] min-h-screen flex flex-col antialiased text-slate-800 font-sans w-full max-w-full overflow-x-hidden">
        
        {/* Zamonaviy Ko'k SaaS Navbar */}
        <header className="bg-white border-b border-slate-200/80 px-5 py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3 rounded-2xl shadow-sm w-full max-w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/15 flex-shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">Vazifalar (Workbook)</h1>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span> Bulutli Sinxronizatsiya
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Tizimdagi ma'lumotlar jadvali va Workbook filtrlari</p>
            </div>
          </div>
          
          {/* O'ng tomon: Profil va Tezkor statistika qismi */}
          <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex-shrink-0">
            <div className="bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl font-mono text-xs text-slate-600 flex items-center gap-2">
              <span className="text-slate-400">=COUNTA() →</span>
              <span className="text-blue-600 font-bold">{tasks.length} ta faol</span>
            </div>
            
            <button 
              onClick={() => setModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-blue-600/10 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus size={14} /> Yangi Satr Qo'shish
            </button>
          </div>
        </header>

        {/* Asosiy Ishchi Hudud */}
        <main className="flex-grow py-6 w-full max-w-full overflow-hidden flex flex-col">
          
          {tasks.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm max-w-2xl mx-auto mt-8 w-full">
              <ClipboardList className="text-slate-300 mb-3" size={40} />
              <h3 className="text-sm font-bold text-slate-700">Jadval bo'sh</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Hozircha hech qanday ma'lumotlar to'plami kiritilmagan. Yuqoridagi tugma orqali yangi qator kiriting.
              </p>
            </div>
          ) : (
            /* JADVAL MAKSIMAL KENGELIKDA VA EKRANDAN CHIQIB KETMAYDI */
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto w-full max-w-full">
              <table className="w-full max-w-full text-left border-collapse table-fixed min-w-[800px]">
                
                {/* Jadval Sarlavhasi (Excel Header Uslubida) */}
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                    <th className="w-[45px] border-r border-slate-200 p-2 text-center bg-slate-100/70"></th>
                    <th className="w-[90px] border-r border-slate-200 p-2 px-3 text-slate-500">ID xotira</th>
                    <th className="w-[30%] border-r border-slate-200 p-2 px-3 text-slate-800 font-extrabold">
                      <div className="flex items-center gap-1">Vazifa Nomi (Task) <ArrowUpDown size={10} className="text-slate-400" /></div>
                    </th>
                    <th className="w-[40%] border-r border-slate-200 p-2 px-3 text-slate-600">Batafsil / Tavsif (Details)</th>
                    <th className="w-[140px] border-r border-slate-200 p-2 px-3 text-slate-600">Yaratilgan Sana</th>
                    <th className="w-[90px] border-r border-slate-200 p-2 text-center text-slate-600">Holat</th>
                    <th className="w-[60px] p-2 text-center text-slate-600">Amal</th>
                  </tr>
                </thead>

                {/* Jadval Tanasi (Excel Cell katakchalari) */}
                <tbody className="divide-y divide-slate-200 font-mono text-xs text-slate-700">
                  {tasks.map((task, index) => (
                    <tr 
                      key={task.id} 
                      className="hover:bg-blue-50/30 transition-colors group border-b border-slate-200"
                    >
                      {/* Excel chetidagi satr raqami paneli */}
                      <td className="border-r border-slate-200 p-2 text-center bg-slate-50 text-[10px] text-slate-400 font-sans select-none font-medium">
                        {index + 1}
                      </td>
                      
                      <td className="border-r border-slate-200 p-2 px-3 text-slate-400 text-[11px]">
                        #{task.id.slice(0, 5).toUpperCase()}
                      </td>
                      
                      <td className="border-r border-slate-200 p-2 px-3 font-sans font-semibold text-slate-900 truncate">
                        {task.title}
                      </td>
                      
                      <td className="border-r border-slate-200 p-2 px-3 font-sans text-slate-500 truncate" title={task.details}>
                        {task.details || <span className="text-slate-300 italic">null</span>}
                      </td>
                      
                      <td className="border-r border-slate-200 p-2 px-3 text-slate-500 text-[11px]">
                        {task.createdAt?.seconds
                          ? moment(task.createdAt.toDate()).format("YYYY-MM-DD HH:mm")
                          : "Hozir..."}
                      </td>
                      
                      <td className="border-r border-slate-200 p-2 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100 font-sans">
                          AKTIV
                        </span>
                      </td>
                      
                      <td className="p-1 text-center">
                        <button
                          onClick={() => openDeleteModal(task)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Satrni o'chirish"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </main>
      </section>

      {/* Vazifa qo'shish modali */}
      {modal && <ModalPage setShowModal={setModal} />}

      {/* Zamonaviy O'chirish Modali */}
      {deleteModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex justify-center items-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all p-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-2.5 text-rose-500 mb-3">
              <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Satrni o'chirishni tasdiqlang</h3>
            </div>

            <div className="mb-6 font-sans">
              <p className="text-xs text-slate-500 leading-relaxed">
                Haqiqatan ham <span className="font-semibold text-slate-900">"{taskToDelete?.title}"</span> nomli satr ma'lumotini bazadan butunlay o'chirib tashlamoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.
              </p>
            </div>

            <div className="flex justify-end gap-2 text-xs font-sans">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all font-semibold cursor-pointer"
                onClick={() => setDeleteModal(false)}
                disabled={isDeleting}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className={`px-4 py-2 rounded-xl text-white font-semibold shadow-md transition-all cursor-pointer
                  ${isDeleting 
                    ? "bg-rose-400 shadow-none cursor-not-allowed" 
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"}`}
                disabled={isDeleting}
              >
                {isDeleting ? "O'chirilmoqda..." : "Tasdiqlayman"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;