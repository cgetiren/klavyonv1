import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { resetToTest, startReplay } from "../store/WordSlice";
import VirtualKeyboard from "./VirtualKeyboard";
import Certificate from "./Certificate";

function InformationArea() {

    const dispatch = useDispatch();
    const isReplaying = useSelector((state: RootState) => state.words.isReplaying);
    const correctCount = useSelector((state: RootState) => state.words.correctWord);
    const rejectCount = useSelector((state: RootState) => state.words.rejectWord);
    const testMode = useSelector((state: RootState) => state.words.testMode);
    const elapsedTime = useSelector((state: RootState) => state.words.elapsedTime);
    const correctKeystrokes = useSelector((state: RootState) => state.words.correctKeystrokes);
    const totalKeystrokes = useSelector((state: RootState) => state.words.totalKeystrokes);

    const minutes = elapsedTime > 0 ? elapsedTime / 60 : 1/60;
    const wpm = Math.max(0, Math.floor((correctKeystrokes / 5) / minutes));
    const kpm = Math.max(0, Math.floor(totalKeystrokes / minutes));
    const accuracy = totalKeystrokes > 0 ? Math.floor((correctKeystrokes / totalKeystrokes) * 100) : 100;
    const totalWordsAttempted = correctCount + rejectCount;

    let titleText = "Sonuç";
    if (testMode === '1min') titleText = "1 Dakikalık Test Sonucu";
    else if (testMode === '3min') titleText = "3 Dakikalık Test Sonucu";
    else titleText = "Süresiz Test Sonucu";

    return (
        <div className="max-w-5xl mx-auto w-full my-12 animate-[InformationAnimate_0.6s_ease-out]">
            <Certificate wpm={wpm} accuracy={accuracy} testMode={testMode} />
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-[var(--swiss-border)] pb-12">
                <div className="flex flex-col">
                    <h1 className="text-xs font-black tracking-[0.3em] uppercase text-neutral-400 mb-4">{titleText}</h1>
                    <div className="flex items-baseline gap-4">
                        <span className="text-[12rem] font-black leading-none tracking-tighter text-[var(--swiss-text)]">{wpm}</span>
                        <span className="text-2xl font-black text-neutral-400 uppercase tracking-widest">WPM</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-8 mt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">TOTAL WORDS</span>
                        <span className="text-4xl font-black text-[var(--swiss-text)]">{totalWordsAttempted}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">CORRECT</span>
                        <span className="text-4xl font-black text-[var(--swiss-text)]">{correctCount}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">INCORRECT</span>
                        <span className="text-4xl font-black text-red-600 dark:text-red-500">{rejectCount}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">ACCURACY</span>
                        <span className="text-4xl font-black text-[var(--swiss-text)]">{accuracy}%</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">KPM (KEYS)</span>
                        <span className="text-4xl font-black text-[var(--swiss-text)]">{kpm}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-12 items-center">
                <button 
                    onClick={() => dispatch(resetToTest())} 
                    className="w-full md:w-auto bg-[var(--swiss-text)] text-[var(--swiss-bg)] px-12 py-5 hover:opacity-90 transition-all duration-200 font-black uppercase tracking-widest text-sm" 
                    type="button"
                >
                    Try Again
                </button>
                <button 
                    onClick={() => dispatch(startReplay())} 
                    disabled={isReplaying}
                    className={`w-full md:w-auto border-2 px-12 py-5 font-black uppercase tracking-widest text-sm transition-all duration-200 ${isReplaying ? 'bg-[var(--swiss-border)] text-neutral-400 border-[var(--swiss-border)] cursor-not-allowed' : 'border-[var(--swiss-text)] text-[var(--swiss-text)] hover:bg-[var(--swiss-text)] hover:text-[var(--swiss-bg)]'}`} 
                    type="button"
                >
                    {isReplaying ? "Watching..." : "Watch Replay"}
                </button>
            </div>
            
            <div className={`mt-16 transition-all duration-700 ${isReplaying ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4'}`}>
                <VirtualKeyboard />
            </div>

        </div>
    )
}

export default InformationArea;
