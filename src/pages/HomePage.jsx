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
import { Trash2, Plus, Calendar, CheckSquare, ClipboardList, AlertTriangle, X } from "lucide-react";

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
      <section className="bg-slate-50/50 min-h-screen flex flex-col antialiased text-slate-800">
        
        {/* Yuqori Header (Navbar) qismi - Mobil va Desktop uchun moslashuvchan */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              <CheckSquare size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none sm:leading-tight">Todo Dashboard</h1>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Vazifalaringizni samarali boshqaring</p>
            </div>
          </div>
          
          {/* Foydalanuvchi Profili - Kichik ekranlarda juda ixcham holatga keladi */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-100/60 py-1 pl-2.5 pr-1.5 sm:py-1.5 sm:pl-4 sm:pr-2 rounded-xl border border-slate-200/40">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="font-bold text-xs sm:text-sm text-slate-800 tracking-wide whitespace-nowrap">SOBIROV XOJIAKBAR</span>
                <span className="text-[9px] sm:text-[11px] font-medium text-blue-600 uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded-md mt-0.5">
                  Foydalanuvchi
                </span>
              </div>
              {/* Mobil qurilmalarda faqat XS qisqartmasi va kichik label ko'rinadi */}
              <div className="flex flex-col items-end sm:hidden">
                <span className="font-bold text-[11px] text-slate-800 tracking-wide">X.Sobirov</span>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 ring-2 ring-white flex-shrink-0">
                XS
              </div>
            </div>
          </div>
        </header>

        {/* Asosiy Kontent qismi */}
        <main className="flex-grow p-4 sm:p-6 max-w-full w-full mx-auto">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="text-slate-400" size={18} />
              <h2 className="text-base sm:text-lg font-bold text-slate-700">
                Barcha vazifalar ({tasks.length})
              </h2>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                <ClipboardList size={24} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-700">Hozircha vazifalar yo'q</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs px-4">
                Kun tartibingizni rejalashtirish uchun yangi vazifa qo'shing.
              </p>
            </div>
          ) : (
            /* Grid tizimi: Mobil 1, Planshet 2, Noutbuk 3, Katta ekranlarda 4 ta ustun */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-24 sm:pb-6">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h3>
                      <button
                        onClick={() => openDeleteModal(task)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all duration-200 flex-shrink-0"
                        title="O'chirish"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-3 whitespace-pre-line leading-relaxed">
                      {task.details || "Tafsilotlar kiritilmagan..."}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar size={12} className="text-slate-400" />
                      <span>
                        {task.createdAt?.seconds
                          ? moment(task.createdAt.toDate()).format("DD.MM.YYYY HH:mm")
                          : "Vaqt noma'lum"}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-[9px] sm:text-[10px] tracking-wide uppercase">
                      Faol
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Floating Action Button (FAB) - Mobil qurilmalarga moslashtirilgan */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 group text-sm sm:text-base"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200 sm:w-5 sm:h-5" />
            <span>Yangi vazifa</span>
          </button>
        </div>
      </section>

      {/* Vazifa qo'shish modali */}
      {modal && <ModalPage setShowModal={setModal} />}

      {/* O'chirishni tasdiqlash modali - Mobil moslashuvchanlik bilan */}
      {deleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 px-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200 p-5 sm:p-6">
            
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-sm">
                <AlertTriangle size={18} className="sm:w-5 sm:h-5" />
              </div>
              <button 
                onClick={() => setDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                <X size={16} className="sm:w-4 sm:h-4" />
              </button>
            </div>

            <div className="mb-5 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">Vazifani o'chirish</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Rostdan ham <span className="font-semibold text-slate-700">"{taskToDelete?.title}"</span> vazifasini o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-[0.98] transition-all"
                onClick={() => setDeleteModal(false)}
                disabled={isDeleting}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-lg shadow-red-500/10 transition-all
                  ${isDeleting 
                    ? "bg-red-400 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-700 active:scale-[0.98]"}`}
                disabled={isDeleting}
              >
                {isDeleting ? "O'chirilmoqda..." : "Ha, o'chirilsin"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;