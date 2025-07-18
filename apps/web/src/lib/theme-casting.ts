import type {appTheme} from "@/types";
// @ts-ignore
import type { Theme } from "@excalidraw/excalidraw";

function themeCasting(theme: appTheme) : Theme{
    if (theme === "dark") return "dark"
    if (theme === "light") return "light"
    return "dark"
}

export default themeCasting