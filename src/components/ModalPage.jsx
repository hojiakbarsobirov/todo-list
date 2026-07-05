import { useState } from "react";
import { db } from '../firebase/config.js'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { X, Calendar, Tag, AlertTriangle, FileText, Plus, Loader2 } from "lucide-react";

const ModalPage = ({ setShowModal }) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("shaxsiy");
  const [priority, setPriority] = useState("orta");
  const [dueDate, setDueDate] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Custom Toast xabarnomasi ko'rsatish
  const showToast = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return showToast("Vazifa nomi kiritilishi shart!", "error");

    setLoading(true);

    try {
      await addDoc(collection(db, "tasks"), {
        title: title.trim(),
        details: details.trim(),
        category: category,
        priority: priority,
        dueDate: dueDate || null,
        createdAt: serverTimestamp()
      });
      
      showToast("Vazifa muvaffaqiyatli saqlandi!", "success");
      
      // Modalni yopishdan oldin muvaffaqiyat hissini berish uchun ozgina kutamiz
      setTimeout(() => {
        setShowModal(false);
      }, 800);
    } catch (error) {
      console.error("Xatolik:", error);
      showToast("Vazifa qo‘shishda xatolik yuz berdi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 px-4 transition-all duration-300">
      
      {/* Toast Alert Xabarnomasi */}
      {notification.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-xl shadow-xl border text-sm font-medium animate-bounce
          ${notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Plus size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Yangi vazifa yaratish</h2>
          </div>
          <button 
            onClick={() => setShowModal(false)}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1.5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* 1. Sarlavha */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pl-1 flex items-center gap-1.5">
              <FileText size={14} className="text-slate-400" /> Vazifa Nomi *
            </label>
            <input
              type="text"
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-sm text-slate-800 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Figma maketini yakunlash"
              disabled={loading}
              required
            />
          </div>

          {/* 2. Ikki ustunli qism: Kategoriya va Prioritet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kategoriya */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pl-1 flex items-center gap-1.5">
                <Tag size={14} className="text-slate-400" /> Kategoriya
              </label>
              <select
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-sm text-slate-700 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                <option value="shaxsiy">🏠 Shaxsiy</option>
                <option value="ish">💼 Ish loyihasi</option>
                <option value="oqish">📚 O'qish / Ta'lim</option>
                <option value="muhim">🔥 Muhim topshiriq</option>
              </select>
            </div>

            {/* Prioritet */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pl-1 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-slate-400" /> Prioritet
              </label>
              <select
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-sm text-slate-700 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={loading}
              >
                <option value="past">🟢 Past daraja</option>
                <option value="orta">🟡 O'rta daraja</option>
                <option value="yuqori">🔴 Yuqori daraja</option>
              </select>
            </div>
          </div>

          {/* 3. Dedlayn (Muddati) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pl-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" /> Yakunlash muddati (Due Date)
            </label>
            <input
              type="datetime-local"
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-sm text-slate-700 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* 4. Qo'shimcha Tafsilotlar */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pl-1">
              Batafsil ma'lumot (Izoh)
            </label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none text-sm text-slate-800 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Vazifa haqida qo'shimcha eslatmalar yozib qoldiring..."
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Modal Footer Tugmalari */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              className="px-5 h-11 text-sm font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-[0.98] transition-all"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Yopish
            </button>
            <button
              type="submit"
              className={`px-6 h-11 text-sm font-semibold text-white rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 transition-all
                ${loading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/20 active:scale-[0.98]"}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                "Saqlash"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPage;