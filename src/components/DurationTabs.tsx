import { useDispatch, useSelector } from 'react-redux';
import { setTestMode, resetToTest } from '../store/WordSlice';
import type { RootState } from '../store/store';

function DurationTabs() {
    const dispatch = useDispatch();
    const testMode = useSelector((state: RootState) => state.words.testMode);
    // isStarted kaldırıldı, artık her an mod değiştirilebilir.

    const handleModeChange = (mode: '1min' | '3min' | 'infinite') => {
        dispatch(setTestMode(mode));
        dispatch(resetToTest());
    };

    const getBtnClass = (mode: string) => {
        let base = "px-4 py-3 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-colors duration-200 border-b-2 ";
        if (testMode === mode) {
            base += "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100";
        } else {
            base += "border-transparent text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100";
        }
        return base;
    };

    return (
        <div className="max-w-5xl w-full mx-auto flex justify-start gap-6 mb-8 border-b border-neutral-200 dark:border-neutral-800">
            <button 
                onClick={() => handleModeChange('1min')}
                className={getBtnClass('1min')}
            >
                1 MIN
            </button>
            <button 
                onClick={() => handleModeChange('3min')}
                className={getBtnClass('3min')}
            >
                3 MIN
            </button>
            <button 
                onClick={() => handleModeChange('infinite')}
                className={getBtnClass('infinite')}
            >
                ∞ INFINITE
            </button>
        </div>
    );
}

export default DurationTabs;
