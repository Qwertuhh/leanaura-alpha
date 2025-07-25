import { useNotebookStore } from "@/store";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

function Notebooks() {
  const notebookStore = useNotebookStore();
  const notebooks = useMemo(
    () => notebookStore.getListOfNotebooks(),
    [notebookStore]
  );
  const createNotebook = useNotebookStore((state) => state.createNotebook);
  const deleteNotebook = useNotebookStore((state) => state.deleteNotebook);
  const renameNotebook = useNotebookStore((state) => state.renameNotebook);

  const [newNotebookName, setNewNotebookName] = useState("");
  const [newName, setNewName] = useState("");

  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-2xl font-bold">Notebooks</h2>

      {/* 📝 Create App */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New notebook name"
          value={newNotebookName}
          onChange={(e) => setNewNotebookName(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={() => {
            if (newNotebookName.trim()) {
              createNotebook(newNotebookName);
              setNewNotebookName("");
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* 📚 App List */}
      {notebooks.length === 0 ? (
        <div className="text-stone-600 dark:text-stone-300">
          No notebooks available.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {notebooks.map((notebook) => {
            return (
              <li
                key={notebook.slug}
                className="flex flex-col gap-2 rounded-md bg-white dark:bg-stone-800 p-3 shadow dark:shadow-stone-700"
              >
                <div className="flex items-center gap-3">
                  <Link
                    to={`/notebook/${notebook.slug}`}
                    className="text-lg font-semibold flex-1 text-stone-800 dark:text-white"
                  >
                    {notebook.notebookName}
                  </Link>
                  <button
                    onClick={() => deleteNotebook(notebook.slug)}
                    className="bg-destructive text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>

                {/* 🔄 Inline Rename Input + Button */}
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Rename..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="p-2 border rounded w-full text-stone-800 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      if (newName.trim()) {
                        renameNotebook(notebook.slug, newName.trim());
                        setNewName("");
                      }
                    }}
                    className="bg-stone-800 dark:bg-stone-600 text-white px-3 py-1 rounded-md"
                  >
                    Rename
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Notebooks;