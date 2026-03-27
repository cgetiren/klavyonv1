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
            className="max-w-5xl overflow-hidden flex flex-wrap content-start gap-x-4 gap-y-3 p-2 mx-auto text-3xl font-bold h-[160px] relative transition-all duration-300"
        >
            {
                data.map((val, actualIndex) => {
                    const isActive = actualIndex === nextWord;
                    let statusClass = wordStatuses[actualIndex] || "bg-white/5 text-gray-400";
                    
                    if (isActive) {
                        statusClass = "border-b-4 border-blue-500 text-white shadow-lg bg-white/20 scale-105";
                    }

                    return (
                        <div 
                            id={"word-" + actualIndex} 
                            key={actualIndex} 
                            className={`px-3 py-1 rounded-lg transition-all duration-200 select-none flex gap-[2px] ${statusClass}`}
                        >
                            {isActive ? (
                                // Aktif kelimeyi karakter karakter ayırarak render et
                                val.split("").map((char, charIdx) => {
                                    let charClass = "text-white"; // Varsayılan: Beyaz
                                    const isTyped = charIdx < actionWord.length;
                                    const isCurrent = charIdx === actionWord.length;

                                    if (isTyped) {
                                        // Yazıldıysa kontrol et
                                        if (actionWord[charIdx] === char) {
                                            charClass = "text-green-400"; // Doğru: Yeşil
                                        } else {
                                            charClass = "bg-red-500/80 text-white rounded px-[2px]"; // Yanlış: Koyu Kırmızı Vurgu
                                        }
                                    } else if (isCurrent) {
                                        // Sıradaki harf ise imleç/vurgu etkisi
                                        charClass = "bg-blue-500/40 border-b-2 border-white animate-pulse rounded-t-sm";
                                    }

                                    return (
                                        <span key={charIdx} className={`transition-all duration-75 ${charClass}`}>
                                            {char}
                                        </span>
                                    );
                                })
                            ) : (
                                // Aktif olmayan kelimeler blok halinde render edilir
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