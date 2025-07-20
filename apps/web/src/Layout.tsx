import ThemeProvider from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";

function Layout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Button>Click Me</Button>
      <ThemeToggle />
    </ThemeProvider>
  );
}

export default Layout;
