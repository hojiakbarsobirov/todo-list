import { useState } from "react";
import {db} from '../firebase/config.js'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ModalPage = ({ setShowModal }) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Task nomi kerak!");

    setLoading(true);

    try {
      await addDoc(collection(db, "tasks"), {
        title: title.trim(),
        details: details.trim(),
        createdAt: serverTimestamp()
      });
      alert("Task muvaffaqiyatli qo‘shildi!");
      setShowModal(false);
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Vazifa qo‘shishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 xl:px-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add new task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">task name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="about what"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">comment</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Additional Information..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Close
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded bg-yellow-400 text-white hover:bg-yellow-500 transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "is being created..." : "Storage"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPage;
