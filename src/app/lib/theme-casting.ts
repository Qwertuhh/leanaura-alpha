import type {appTheme} from "@/app/types";
import type { Theme } from "@/app/components/theme-provider";

function themeCasting(theme:Theme) : appTheme{
    if (theme === "dark") return "dark"
    if (theme === "light") return "light"
    return "dark"
}

export default themeCasting