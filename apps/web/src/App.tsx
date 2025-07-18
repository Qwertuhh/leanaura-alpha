import {ThemeProvider} from "@/components/theme-provider";
import {useNotebookStore} from "@/store";

function App() {
    const notebookStore = useNotebookStore();
    const listOfNotebooks = notebookStore.getListOfNotebooks()
    const createNotebook = useNotebookStore((state) => state.createNotebook);
    if (listOfNotebooks.length <= 0) {
        //! To initialize the notebooks store
        createNotebook("Welcome to Toci Alpha");
        notebookStore.deleteNotebook("Welcome to Toci Alpha");
    }
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="h-screen flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bold">Toci Alpha</h1>
                <p className="text-2xl mt-4">A simple note taking app</p>
                <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md mt-8"
                    onClick={() => (window.location.href = "/notebooks")}
                >
                    Go to Notebooks
                </button>
            </div>
        </ThemeProvider>
    );
}

export default App;