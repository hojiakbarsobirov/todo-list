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

const HomePage = () => {
  const [modal, setModal] = useState(false);
  const [tasks, setTasks] = useState([]);

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

  const handleDelete = async (id) => {
    const confirm = window.confirm("should it be deleted?");
    if (!confirm) return;
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <>
      <section className="bg-gray-100 h-screen flex flex-col">
        <header className="bg-white shadow px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-serif">Todo List</h1>
          <div className="flex gap-3 items-center">
            <span className="font-semibold">Admin - X</span>
            <img
              src="/profile-admin.png"
              alt="admin"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        <main className="flex-grow p-4 overflow-y-scroll">
          {tasks.length === 0 ? (
            <p className="text-gray-600 italic pl-5">
              No tasks. Add a new task.
            </p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white shadow p-4 rounded flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-700">
                      {task.title}
                    </h3>
                    <p className="text-gray-600">{task.details}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      🕒 {task.createdAt?.seconds
                        ? moment(task.createdAt.toDate()).format(
                            "YYYY-MM-DD HH:mm"
                          )
                        : "Vaqt yo‘q"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    <img className="w-8" src="/delete.png" alt="" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="p-6 bg-white flex justify-center">
          <button
            onClick={() => setModal(true)}
            className="hover:scale-105 p-4 rounded-full transition ease-in-out"
          >
            <img src="/plus.png" alt="plus" className="w-12" />
          </button>
        </footer>
      </section>

      {modal && <ModalPage setShowModal={setModal} />}
    </>
  );
};

export default HomePage;
