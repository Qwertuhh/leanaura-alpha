import type {appTheme} from "@/types";
import type { Theme } from "@/components/theme-provider";

function themeCasting(theme:Theme) : appTheme{
    if (theme === "dark") return "dark"
    if (theme === "light") return "light"
    return "dark"
}

export default themeCasting