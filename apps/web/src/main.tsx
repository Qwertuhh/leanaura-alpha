import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Layout from './Layout.tsx'
import Notebooks from '@/pages/notebooks/App.tsx'
import Notebook from "@/pages/notebook/App.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route path="/" element={<App/>}/>
                    <Route path="/notebooks" element={<Notebooks/>}/>
                    <Route path="/notebook/:notebook_name" element={<Notebook/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
)


