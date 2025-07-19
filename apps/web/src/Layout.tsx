import {ThemeProvider} from "@/components/theme-provider";
import ThemeToggle from "./components/theme-toggle.tsx";
import {Outlet} from "react-router-dom";

function Layout() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="toci-theme">
            <div className="fixed bottom-4 right-4">
                <ThemeToggle />
            </div>
            <Outlet/>
        </ThemeProvider>
    );
}

export default Layout;