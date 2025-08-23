import type { FC } from 'react';
import { Maximize, Minimize } from 'lucide-react';

interface PlaygroundProps {
    toggleMaximization: () => void;
    isMaximized: boolean;
}

export const Playground: FC<PlaygroundProps> = ({ toggleMaximization, isMaximized }) => {
    return (
        <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg w-full h-full flex flex-col">
            <div className="p-2 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center">
                <h2 className="font-semibold text-md">Playground</h2>
                <button onClick={toggleMaximization} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700">
                    {isMaximized ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
            </div>
            <div className="p-4 flex-grow">
                {/* Playground content goes here */}
            </div>
        </div>
    );
};
