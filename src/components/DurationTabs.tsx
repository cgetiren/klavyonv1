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
        let base = "px-6 py-2 text-sm font-bold tracking-wider uppercase rounded-t-xl transition-all duration-300 ";
        if (testMode === mode) {
            base += "bg-blue-600/80 text-white shadow-[0_-4px_10px_rgba(37,99,235,0.3)]";
        } else {
            base += "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10";
        }
        return base;
    };

    return (
        <div className="max-w-300 mx-auto flex justify-center gap-1 mb-0 border-b border-white/10 pb-0 backdrop-blur-sm">
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
                ∞
            </button>
        </div>
    );
}

export default DurationTabs;
