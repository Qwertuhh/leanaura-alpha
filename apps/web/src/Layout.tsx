import ThemeProvider from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
      <footer className="fixed bottom-2 left-2 text-xs text-muted-foreground">
        <a
          href="/WARRANTY.md"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Warranty & Liability
        </a>
      </footer>
      <div className="fixed bottom-2 right-2">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default Layout;
