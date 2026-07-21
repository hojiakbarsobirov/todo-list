import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config'; 
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  MapPin, 
  Car, 
  X, 
  Filter, 
  RefreshCw,
  Building2
} from 'lucide-react';

// Haval modellari ro'yxati
const HAVAL_MODELS = ['H6', 'JOLION', 'M6', 'DARGO', 'H9', 'WINGLE 7'];

const INITIAL_FORM_STATE = {
  model: 'H6', // Standart tanlov
  vin: '',
  location: 'Skladda', 
  status: 'Faol', 
  note: ''
};

const LOCATION_PRESETS = ['Skladda', 'Salonda', 'Ko\'chada', 'Trailerda (Yo\'lda)'];

const DocumentsPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [modelFilter, setModelFilter] = useState('Barchasi'); // Model bo'yicha filter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // 1. Firebase Firestore-dan real-time ma'lumotlarni olish
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'vehicles'),
      (snapshot) => {
        const docsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        docsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setVehicles(docsData);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore xatosi:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Modalni ochish va formani tayyorlash
  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setEditingId(vehicle.id);
      setFormData({
        model: vehicle.model || 'H6',
        vin: vehicle.vin || '',
        location: vehicle.location || 'Skladda',
        status: vehicle.status || 'Faol',
        note: vehicle.note || ''
      });
    } else {
      setEditingId(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setIsModalOpen(true);
  };

  // 3. Ma'lumot qo'shish yoki tahrirlash
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        make: 'Haval',
        model: formData.model,
        vin: formData.vin.toUpperCase().trim(),
        location: formData.location.trim(),
        status: formData.status,
        note: formData.note.trim(),
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'vehicles', editingId), payload);
      } else {
        await addDoc(collection(db, 'vehicles'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      setIsModalOpen(false);
      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
      alert("Ma'lumotni saqlashda xatolik yuz berdi!");
    }
  };

  // 4. Statusni o'zgartirish
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'vehicles', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Status xatosi:", error);
    }
  };

  // 5. O'chirish
  const handleDelete = async (id) => {
    if (window.confirm("Rostdan ham ushbu Haval avtomobilini o'chirmoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, 'vehicles', id));
      } catch (error) {
        console.error("O'chirishda xatolik:", error);
      }
    }
  };

  // Qidiruv va Filterlash (Model va Status mosligi)
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.model?.toLowerCase().includes(search.toLowerCase()) ||
      v.vin?.toLowerCase().includes(search.toLowerCase()) ||
      v.location?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'Barchasi' || v.status === statusFilter;
    const matchesModel = modelFilter === 'Barchasi' || v.model === modelFilter;

    return matchesSearch && matchesStatus && matchesModel;
  });

  // Statistika
  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status !== 'Sotildi').length,
    sold: vehicles.filter(v => v.status === 'Sotildi').length,
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded tracking-wider uppercase">
              HAVAL
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Avtopark Boshqaruvi</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mashinalar joylashuvi, VIN kodlari va sotuv holatlarini boshqarish
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Yangi Haval Qo'shish</span>
        </button>
      </div>

      {/* STATISTIKA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Jami Haval</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Car size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-medium text-amber-600 uppercase tracking-wider">Mavjud (Omborda/Yo'lda)</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{stats.active}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Building2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">Sotilganlar</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{stats.sold}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="VIN kod yoki Joylashuv..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Model Filter */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200/60 text-xs">
            <select 
              value={modelFilter} 
              onChange={(e) => setModelFilter(e.target.value)}
              className="bg-transparent border-none py-1 px-2 text-slate-700 font-medium focus:ring-0 cursor-pointer outline-none"
            >
              <option value="Barchasi">Barcha Modellar</option>
              {HAVAL_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200/60 text-xs">
            <Filter size={14} className="ml-2 text-slate-400" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none py-1 px-2 text-slate-700 font-medium focus:ring-0 cursor-pointer outline-none"
            >
              <option value="Barchasi">Barcha Holatlar</option>
              <option value="Faol">Mavjud (Sotilmagan)</option>
              <option value="Sotildi">Sotilganlar</option>
            </select>
          </div>
        </div>
      </div>

      {/* JADVAL */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs relative">
        {loading && (
          <div className="p-12 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <RefreshCw className="animate-spin text-blue-600" size={18} />
            <span>Ma'lumotlar yuklanmoqda...</span>
          </div>
        )}

        {!loading && filteredVehicles.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            Hech qanday Haval avtomobili topilmadi.
          </div>
        )}

        {!loading && filteredVehicles.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4">VIN Kod</th>
                  <th className="py-3 px-4">Joylashuvi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Izoh</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredVehicles.map((v, index) => {
                  const isSold = v.status === 'Sotildi';

                  return (
                    <tr 
                      key={v.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSold ? 'bg-slate-50/50 text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>

                      {/* Model */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-[10px] bg-red-50 text-red-600 border border-red-200/60 px-1.5 py-0.5 rounded font-mono">
                            HAVAL
                          </span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-800">
                            {v.model}
                          </span>
                        </span>
                      </td>

                      {/* VIN Kod */}
                      <td className="py-3 px-4 font-mono font-semibold tracking-wider text-slate-800 select-all">
                        {v.vin || '—'}
                      </td>

                      {/* Joylashuvi */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                          <MapPin size={13} className="text-blue-500" />
                          {v.location}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-4">
                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border cursor-pointer outline-none transition-all ${
                            isSold 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          <option value="Faol">Mavjud</option>
                          <option value="Sotildi">✅ Sotildi</option>
                        </select>
                      </td>

                      {/* Izoh */}
                      <td className="py-3 px-4 text-slate-400 truncate max-w-[180px]">
                        {v.note || '—'}
                      </td>

                      {/* Amallar */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(v)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(v.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                  H
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  {editingId ? "Haval Ma'lumotlarini Tahrirlash" : "Yangi Haval Qo'shish"}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              {/* MODELNI TUGMALAR VA SELECT ORQALI TANLASH */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Haval Modeli *</label>
                
                {/* 1-bosishda tanlash tugmalari */}
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {HAVAL_MODELS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, model: m })}
                      className={`py-2 px-2 rounded-xl font-bold border transition-all text-center ${
                        formData.model === m 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* VIN KOD */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">VIN Kod (17 belgili) *</label>
                <input
                  type="text"
                  required
                  maxLength={17}
                  placeholder="VIN kodni kiriting..."
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold tracking-wider text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* JOYLASHUV */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Joylashuvi (Qayerda?) *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Skladda, Salonda, Ko'chada..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all mb-2"
                />

                {/* Joylashuv tezkor tugmalari */}
                <div className="flex flex-wrap gap-1.5">
                  {LOCATION_PRESETS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setFormData({ ...formData, location: loc })}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                        formData.location === loc 
                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Holati</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium cursor-pointer"
                >
                  <option value="Faol">Mavjud (Sotilmagan)</option>
                  <option value="Sotildi">✅ Sotildi</option>
                </select>
              </div>

              {/* IZOH */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Izoh (ixtiyoriy)</label>
                <textarea
                  rows={2}
                  placeholder="Mijoz ismi, broni yoki boshqa eslatma..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors"
                >
                  {editingId ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DocumentsPage;