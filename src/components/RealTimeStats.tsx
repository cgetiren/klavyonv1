import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tickTime, finishTest } from '../store/WordSlice';
import type { RootState } from '../store/store';

function RealTimeStats() {
    const dispatch = useDispatch();
    const elapsedTime = useSelector((state: RootState) => state.words.elapsedTime);
    const timeRemaining = useSelector((state: RootState) => state.words.timeRemaining);
    const testMode = useSelector((state: RootState) => state.words.testMode);
    const correctKeystrokes = useSelector((state: RootState) => state.words.correctKeystrokes);
    const totalKeystrokes = useSelector((state: RootState) => state.words.totalKeystrokes);
    const isStarted = useSelector((state: RootState) => state.words.isStarted);
    const isComplete = useSelector((state: RootState) => state.words.isComplete);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isStarted && !isComplete) {
            interval = setInterval(() => {
                dispatch(tickTime());
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isStarted, isComplete, dispatch]);

    const calculateWPM = () => {
        const minutes = elapsedTime > 0 ? elapsedTime / 60 : 1/60; // 1 saniyeden azsa 1 saniye say
        // Standart WPM formülü: (Doğru Karakter Sayısı / 5) / Dakika
        const wpm = (correctKeystrokes / 5) / minutes;
        return Math.max(0, Math.floor(wpm));
    };

    const calculateAccuracy = () => {
        if (totalKeystrokes === 0) return 100;
        const accuracy = (correctKeystrokes / totalKeystrokes) * 100;
        return Math.floor(accuracy);
    };

    return (
        <div className="max-w-5xl w-full mx-auto flex justify-between items-end text-[var(--swiss-text)] pb-8 mb-8 border-b border-[var(--swiss-border)]">
            <div className="flex gap-12 items-end">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        {testMode === 'infinite' ? 'ELAPSED' : 'REMAINING'}
                    </span>
                    <span className="text-5xl font-black tabular-nums leading-none">
                        {testMode === 'infinite' ? elapsedTime : timeRemaining}<span className="text-sm font-bold ml-1 text-neutral-400">s</span>
                    </span>
                </div>
                
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">WPM</span>
                    <span className="text-5xl font-black tabular-nums leading-none">{calculateWPM()}</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">ACCURACY</span>
                    <span className="text-5xl font-black tabular-nums leading-none">{calculateAccuracy()}<span className="text-sm font-bold text-neutral-400">%</span></span>
                </div>
            </div>

            {testMode === 'infinite' && isStarted && !isComplete && (
                <button 
                    onClick={() => dispatch(finishTest())}
                    className="border-2 border-[var(--swiss-text)] hover:bg-[var(--swiss-text)] hover:text-[var(--swiss-bg)] px-8 py-3 font-black transition-all duration-200 text-xs uppercase tracking-widest"
                >
                    Finish Test
                </button>
            )}
        </div>
    );
}

export default RealTimeStats;
