import * as React from 'react';

const togglePanel = (setShow: React.Dispatch<React.SetStateAction<boolean>>, show: boolean) => {
    setShow(!show);
};

export default togglePanel;