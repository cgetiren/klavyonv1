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
        const minutes = elapsedTime > 0 ? elapsedTime / 60 : 1;
        const wpm = (totalKeystrokes / 5) / minutes;
        return Math.max(0, Math.floor(wpm));
    };

    const calculateAccuracy = () => {
        if (totalKeystrokes === 0) return 100;
        const accuracy = (correctKeystrokes / totalKeystrokes) * 100;
        return Math.floor(accuracy);
    };

    return (
        <div className="max-w-300 mx-auto flex justify-between items-center text-white p-6 mb-4 bg-white/5 backdrop-blur-md border-x border-b border-white/10 rounded-b-2xl shadow-2xl">
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">
                    {testMode === 'infinite' ? 'Geçen Süre' : 'Kalan Süre'}
                </span>
                <span className="text-4xl font-black tabular-nums">
                    {testMode === 'infinite' ? elapsedTime : timeRemaining}<span className="text-lg font-normal ml-1">sn</span>
                </span>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-green-400 mb-1">Hız (WPM)</span>
                <span className="text-4xl font-black tabular-nums">{calculateWPM()}</span>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="flex flex-col items-center relative">
                <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1">Doğruluk</span>
                <span className="text-4xl font-black tabular-nums">%{calculateAccuracy()}</span>
            </div>

            {testMode === 'infinite' && isStarted && !isComplete && (
                <>
                    <div className="h-10 w-px bg-white/10"></div>
                    <button 
                        onClick={() => dispatch(finishTest())}
                        className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 px-6 py-2 rounded-xl font-bold transition-all duration-300 text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    >
                        Testi Bitir
                    </button>
                </>
            )}
        </div>
    );
}

export default RealTimeStats;
