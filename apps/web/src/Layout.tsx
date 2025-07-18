import {ThemeProvider} from "@/components/theme-provider";
import ThemeToggle from "./components/theme-toggle.tsx";
import {Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import type {appTheme as appThemeType} from "@/types";

let appTheme:appThemeType = "dark";
function Layout() {
    const [currentTheme, setCurrentTheme] = useState<appThemeType>("dark");

    useEffect(() => {
        console.log(`currentTheme: ${currentTheme}`);
        appTheme = currentTheme;
    }, [currentTheme]);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="toci-theme">
            <div className="fixed bottom-4 right-4">
                <ThemeToggle setCurrentTheme={setCurrentTheme}/>
            </div>
            <Outlet/>
        </ThemeProvider>
    );
}

export default Layout;
export {appTheme};