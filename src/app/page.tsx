"use client";

import { useNotebookStore } from "@/store";
import { NotebookStoreState } from "@/types";
import Image from "next/image"

function App() {
  const notebookStore = useNotebookStore();
  const listOfNotebooks = notebookStore.getListOfNotebooks();
  const createNotebook = useNotebookStore((state: NotebookStoreState) => state.createNotebook);
  if (listOfNotebooks.length <= 0) {
    //! To initialize the notebooks store
    createNotebook("Welcome to Toci Alpha");
    notebookStore.deleteNotebook("Welcome to Toci Alpha");
  }
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-44 pt-20">
      <div className="flex flex-col items-center gap-4">
        <Image src="/leanaura_icon.svg" alt="leanaura logo" className="w-20 h-20 bg-white m-2 p-2 rounded" />
        <h1 className="text-6xl font-extrabold">LeanAura</h1>
        <p className="text-sm text-muted-foreground">This is a solution built to provide all-time available resources and teachers to guide you in your learning path
        </p>
      </div>
      <button
        className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium transition-all hover:bg-primary/90"
        onClick={() => (window.location.href = "/notebooks")}
      >
        Get Started
      </button>
    </div>
  );
}

export default App;
