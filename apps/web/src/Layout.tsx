import ThemeProvider from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";
import {Outlet} from "react-router-dom";
import Footer from "@/components/footer";

function Layout() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Outlet/>
            <Footer/>
            <div className="fixed bottom-2 right-2">
                <ThemeToggle/>
            </div>
        </ThemeProvider>
    );
}

export default Layout;
