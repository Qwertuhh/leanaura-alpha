import * as React from "react";
import type {ImperativePanelGroupHandle} from "react-resizable-panels";

const togglePanel = (panelIndex: number, panelGroupRef: React.RefObject<ImperativePanelGroupHandle | null>) => {
    const currentLayout = panelGroupRef.current?.getLayout();
    if (!currentLayout) return;

    const newLayout = [...currentLayout];

    // Toggle the selected panel's size
    newLayout[panelIndex] = newLayout[panelIndex] > 0 ? 0 : 33; // Use a non-zero placeholder

    const activePanels = newLayout.filter(size => size > 0);
    const activePanelCount = activePanels.length;

    if (activePanelCount === 0) {
        // If all panels are closed, show the canvas
        newLayout[1] = 100;
        panelGroupRef.current?.setLayout(newLayout);
    } else {
        const newSize = 100 / activePanelCount;
        panelGroupRef.current?.setLayout(newLayout.map(size => (size > 0 ? newSize : 0)));
    }
};

export default togglePanel;