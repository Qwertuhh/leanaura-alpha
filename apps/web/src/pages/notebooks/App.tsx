import { useNotebookStore } from "@/store";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

function Notebooks() {
  const notebookStore = useNotebookStore();
  const notebooksName = useMemo(
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
      {notebooksName.length === 0 ? (
        <div>No notebooks available.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {notebooksName.map((title, index) => {
            return (
              <li
                key={index}
                className="flex flex-col gap-2 rounded-md bg-white p-3 shadow"
              >
                <div className="flex items-center gap-3">
                  <Link
                    to={`/notebook/${title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-lg font-semibold flex-1"
                  >
                    {title}
                  </Link>
                  <button
                    onClick={() => deleteNotebook(title)}
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
                    className="p-2 border rounded w-full"
                  />
                  <button
                    onClick={() => {
                      if (newName.trim()) {
                        renameNotebook(title, newName.trim());
                        setNewName("");
                      }
                    }}
                    className="bg-primary text-white px-3 py-1 rounded-md"
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
