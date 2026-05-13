import { useEffect, useRef } from "react";
import { getWords } from "../store/WordSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";

function WordArea() {
    const data = useSelector((state : RootState) => state.words.dataWords);
    const nextWord = useSelector((state : RootState) => state.words.nextword);
    const wordStatuses = useSelector((state: RootState) => state.words.wordStatuses);
    const actionWord = useSelector((state: RootState) => state.words.actionWord); // Yazılan anlık kelime
    const dispatch = useDispatch();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(getWords());
    }, [dispatch]);

    useEffect(() => {
        if (!containerRef.current) return;
        const activeWordEl = document.getElementById("word-" + nextWord);
        
        if (activeWordEl) {
            const paddingTop = 24; 
            const targetScrollTop = Math.max(0, activeWordEl.offsetTop - paddingTop);
            
            if (containerRef.current.scrollTop !== targetScrollTop) {
                containerRef.current.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
            }
        }
    }, [nextWord]);

    return (
        <div 
            ref={containerRef} 
            id="words" 
            className="max-w-5xl overflow-hidden flex flex-wrap content-start gap-x-6 gap-y-4 mx-auto text-4xl font-medium h-[180px] relative transition-all duration-300"
        >
            {
                data.map((val, actualIndex) => {
                    const isActive = actualIndex === nextWord;
                    const status = wordStatuses[actualIndex] || "default";
                    let statusClass = "text-neutral-300 dark:text-neutral-700 retro:text-neutral-900 tokyo:text-[#1E293B]";
                    
                    if (isActive) {
                        statusClass = "text-[var(--swiss-text)] font-bold";
                    } else if (status === "wrong") {
                        statusClass = "text-red-600 dark:text-red-500 retro:text-red-400 tokyo:text-[#E879F9] line-through opacity-60";
                    } else if (status === "correct") {
                        statusClass = "text-[var(--swiss-text)] opacity-40";
                    }

                    return (
                        <div 
                            id={"word-" + actualIndex} 
                            key={actualIndex} 
                            className={`transition-all duration-200 select-none flex gap-[1px] ${statusClass}`}
                        >
                            {isActive ? (
                                // Aktif kelimeyi karakter karakter ayırarak render et
                                val.split("").map((char, charIdx) => {
                                    let charClass = "text-[var(--swiss-text)]"; 
                                    const isTyped = charIdx < actionWord.length;
                                    const isCurrent = charIdx === actionWord.length;

                                    if (isTyped) {
                                        if (actionWord[charIdx] === char) {
                                            charClass = "text-[var(--swiss-text)]"; 
                                        } else {
                                            charClass = "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30"; 
                                        }
                                    } else if (isCurrent) {
                                        charClass = "relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-[var(--swiss-text)] after:cursor-blink";
                                    }

                                    return (
                                        <span key={charIdx} className={`transition-all duration-75 ${charClass}`}>
                                            {char}
                                        </span>
                                    );
                                })
                            ) : (
                                // Aktif olmayan kelimeler
                                val 
                            )}
                        </div>
                    );
                })
            }
        </div>
    );
}

export default WordArea;
