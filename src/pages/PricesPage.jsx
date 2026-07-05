import { useEffect, useState } from "react";
import { db } from "../firebase/config.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Trash2, Plus, Search, Package, Car, Wrench, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

const PricesPage = () => {
  // State-lar
  const [parts, setParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [partToDelete, setPartToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // Yangi zapchast formasi uchun state (Kelish va Sotish narxlari bilan)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    costPrice: "", // Kelish narxi
    salePrice: "", // Sotish narxi
    stock: "",
    carModel: "",
  });

  // Firebasedan real-time ma'lumotlarni o'qish
  useEffect(() => {
    const q = query(collection(db, "spare_parts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const partsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParts(partsData);
    });
    return () => unsubscribe();
  }, []);

  // Yangi zapchast qo'shish funksiyasi
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.costPrice || !formData.salePrice) return;

    try {
      await addDoc(collection(db, "spare_parts"), {
        name: formData.name,
        code: formData.code || "N/A",
        costPrice: Number(formData.costPrice),
        salePrice: Number(formData.salePrice),
        stock: Number(formData.stock) || 0,
        carModel: formData.carModel || "Umumiy",
        createdAt: serverTimestamp(),
      });

      // Formani tozalash va modalni yopish
      setFormData({ name: "", code: "", costPrice: "", salePrice: "", stock: "", carModel: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Zapchast qo'shishda xatolik:", error);
    }
  };

  // O'chirishni boshlash
  const openDeleteModal = (part) => {
    setPartToDelete(part);
    setDeleteModal(true);
  };

  // Firebasedan butunlay o'chirish
  const handleConfirmDelete = async () => {
    if (!partToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "spare_parts", partToDelete.id));
      setDeleteModal(false);
      setPartToDelete(null);
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Qidiruv tizimi
  const filteredParts = parts.filter((part) =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.carModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        
        {/* Yuqori boshqaruv paneli (Header) */}
        <header className="bg-white border border-slate-200/80 px-5 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 rounded-xl shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/15 flex-shrink-0">
              <Wrench size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">Zapchastlar va Narxlar</h1>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 font-medium">
                  UZS • Ombor Nazorati
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Ehtiyot qismlarning kelish, sotish narxlari va qoldiq hisobi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Qidiruv inputi */}
            <div className="relative flex-grow sm:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Qidirish (Nomi, Kodi...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-blue-600/10 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus size={14} /> Zapchast Qo'shish
            </button>
          </div>
        </header>

        {/* Ma'lumotlar jadvali */}
        {filteredParts.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm max-w-2xl mx-auto mt-8 w-full">
            <Package className="text-slate-300 mb-3" size={40} />
            <h3 className="text-sm font-bold text-slate-700">Hech narsa topilmadi</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Omborda zapchastlar mavjud emas yoki qidiruv so'rovingiz bo'yicha ma'lumot topilmadi.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto w-full max-w-full">
            <table className="w-full text-left border-collapse table-fixed min-w-[950px]">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th className="w-[45px] border-r border-slate-200 p-2 text-center bg-slate-100/70">#</th>
                  <th className="w-[120px] border-r border-slate-200 p-2 px-3 text-slate-600">Artikul / Kod</th>
                  <th className="w-[22%] border-r border-slate-200 p-2 px-3 text-slate-800 font-extrabold">Ehtiyot Qismi Nomi</th>
                  <th className="w-[15%] border-r border-slate-200 p-2 px-3 text-slate-600">Avtomobil Rusumi</th>
                  <th className="w-[140px] border-r border-slate-200 p-2 px-3 text-slate-600 text-right pr-4">Kelish Narxi</th>
                  <th className="w-[140px] border-r border-slate-200 p-2 px-3 text-blue-600 text-right pr-4">Sotish Narxi</th>
                  <th className="w-[90px] border-r border-slate-200 p-2 text-center text-slate-600">Soni</th>
                  <th className="w-[60px] p-2 text-center text-slate-600">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs text-slate-700">
                {filteredParts.map((part, index) => (
                  <tr key={part.id} className="hover:bg-blue-50/30 transition-colors group border-b border-slate-200">
                    <td className="border-r border-slate-200 p-2 text-center bg-slate-50 text-[10px] text-slate-400 font-sans select-none font-medium">
                      {index + 1}
                    </td>
                    <td className="border-r border-slate-200 p-2 px-3 text-slate-500 text-[11px] truncate">
                      {part.code}
                    </td>
                    <td className="border-r border-slate-200 p-2 px-3 font-sans font-semibold text-slate-900 truncate">
                      {part.name}
                    </td>
                    <td className="border-r border-slate-200 p-2 px-3 font-sans text-slate-600 truncate">
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        <Car size={10} className="text-slate-400" /> {part.carModel}
                      </span>
                    </td>
                    <td className="border-r border-slate-200 p-2 px-3 text-slate-600 text-right pr-4">
                      {part.costPrice ? `${part.costPrice.toLocaleString()} so'm` : "0 so'm"}
                    </td>
                    <td className="border-r border-slate-200 p-2 px-3 text-blue-600 font-bold text-right pr-4">
                      {part.salePrice ? `${part.salePrice.toLocaleString()} so'm` : "0 so'm"}
                    </td>
                    <td className="border-r border-slate-200 p-2 text-center font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${part.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {part.stock} ta
                      </span>
                    </td>
                    <td className="p-1 text-center">
                      <button
                        onClick={() => openDeleteModal(part)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="O'chirish"
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
      </div>

      {/* YANGI ZAPCHAST QO'SHISH MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex justify-center items-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Plus size={16} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Yangi Ehtiyot Qismi Qo'shish</h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Zapchast Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Old amortizator, Motor moyi..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Artikul / Kod</label>
                  <input
                    type="text"
                    placeholder="Kodi yoki zavod raqami"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Avtomobil Rusumi</label>
                  <input
                    type="text"
                    placeholder="Cobalt, Gentra, Tracker..."
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kelish Narxi (so'm) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Tannarxi"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-blue-600 font-semibold mb-1">Sotish Narxi (so'm) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Sotilish narxi"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-blue-50/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Soni (Ombordagi qoldiq)</label>
                <input
                  type="number"
                  placeholder="Nechta borligini kiriting"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md shadow-blue-600/10 transition-all cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* O'CHIRISHNI TASDIQLASH MODALI */}
      {deleteModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex justify-center items-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5 text-rose-500 mb-3">
              <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Zapchastni o'chirish</h3>
            </div>
            <div className="mb-6 font-sans text-xs text-slate-500 leading-relaxed">
              Haqiqatan ham <span className="font-semibold text-slate-900">"{partToDelete?.name}"</span> mahsulotini bazadan butunlay o'chirib tashlamoqchimisiz?
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
                className={`px-4 py-2 rounded-xl text-white font-semibold shadow-md transition-all cursor-pointer ${isDeleting ? "bg-rose-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"}`}
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

export default PricesPage;