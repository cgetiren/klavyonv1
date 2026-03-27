import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recordKey, stopReplay } from '../store/WordSlice';
import type { RootState } from '../store/store';

// Türkçe Q klavye dizilimi (küçük harflerle)
const keyboardLayout = [
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü', 'backspace'],
    ['capslock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i', 'enter'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç', '.', 'şhift'],
    ['space']
];

function VirtualKeyboard() {
    const [activeKeys, setActiveKeys] = useState<Record<string, { isCorrect: boolean }>>({});
    const dispatch = useDispatch();
    const isReplaying = useSelector((state: RootState) => state.words.isReplaying);
    const keystrokeRecord = useSelector((state: RootState) => state.words.keystrokeRecord);
    const elapsedTime = useSelector((state: RootState) => state.words.elapsedTime);

    useEffect(() => {
        if (isReplaying) return; // Replay modundaysa manual etkinlikleri dinleme

        const handleKeyDown = (e: KeyboardEvent) => {
            let key = e.key.toLowerCase();
            
            if (e.code === 'Space') {
                key = 'space';
            }
            if (key === 'i̇') {
                key = 'i'; // Türkçede i tuşuna basılınca I -> i̇ sorunu oluşabiliyor.
            }
            if (e.key === 'I' && e.code === 'KeyI') {
                key = 'ı'; // Büyük I aslında ı tuşunda olabilir gibi ama genelde e.key doğru değeri verir.
            }

            setActiveKeys(prev => ({ ...prev, [key]: { isCorrect: true } }));
            dispatch(recordKey({ key: key }));
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            let key = e.key.toLowerCase();
            if (e.code === 'Space') key = 'space';
            setActiveKeys(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [dispatch, isReplaying]);

    // Oynatıcı (Replay) Motoru
    useEffect(() => {
        if (!isReplaying || keystrokeRecord.length === 0) return;

        // Toplam süreyi 20 saniyeye sığdıracağız.
        const actualDurationMs = elapsedTime * 1000 || 60000;
        const replayDurationMs = 20000; // 20 saniye
        const speedMultiplier = actualDurationMs / replayDurationMs;

        const timeouts: number[] = [];

        keystrokeRecord.forEach((record) => {
            const replayTime = record.timeOffset / speedMultiplier;
            
            const timeoutId = window.setTimeout(() => {
                const isCorrect = record.isCorrect !== false;
                setActiveKeys(prev => ({ ...prev, [record.key]: { isCorrect } }));
                
                // Doğruysa kısa (100ms), yanlışsa uzun (2000ms) süre ekranda kalsın
                const stayDuration = isCorrect ? 100 : 2000;
                
                const releaseTimeoutId = window.setTimeout(() => {
                    setActiveKeys(prev => {
                        const next = { ...prev };
                        delete next[record.key];
                        return next;
                    });
                }, stayDuration);
                timeouts.push(releaseTimeoutId);

            }, replayTime);

            timeouts.push(timeoutId);
        });

        // 20 Saniye sonra tekrar modunu kapat
        const finishTimeout = window.setTimeout(() => {
            dispatch(stopReplay());
            setActiveKeys({});
        }, replayDurationMs + 500); // 500ms ekstra boşluk payı

        timeouts.push(finishTimeout);

        // Cleanup
        return () => {
            timeouts.forEach(id => clearTimeout(id));
            setActiveKeys({});
        };
    }, [isReplaying, keystrokeRecord, elapsedTime, dispatch]);

    const getKeyStyle = (key: string) => {
        let baseStyle = "flex items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white shadow-lg font-bold uppercase transition-all duration-200 ";
        
        let widthStr = "w-10 h-10 sm:w-14 sm:h-14 text-sm sm:text-xl"; // Biraz daha büyük ve ferah tuşlar
        
        if (key === 'tab' || key === 'enter' || key === 'capslock' || key === 'shift' || key === 'şhift') {
            widthStr = "w-16 sm:w-24 px-2 h-10 sm:h-14 text-xs sm:text-sm";
        }
        if (key === 'backspace') {
            widthStr = "w-20 sm:w-28 px-2 h-10 sm:h-14 text-xs sm:text-sm";
        }
        if (key === 'space') {
            widthStr = "w-96 sm:w-[600px] h-10 sm:h-14";
        }

        const activeInfo = activeKeys[key] || (key === 'şhift' ? activeKeys['shift'] : null);
        const isActive = !!activeInfo;

        if (isActive) {
            if (isReplaying) {
                if (activeInfo.isCorrect) {
                    baseStyle = "flex items-center justify-center rounded-xl border border-green-400 bg-green-500/80 text-white shadow-[0_0_25px_rgba(34,197,94,0.8)] scale-90 z-10 transition-all duration-75 ";
                } else {
                    baseStyle = "flex items-center justify-center rounded-xl border border-red-400 bg-red-500/80 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-90 z-10 transition-all duration-75 ";
                }
            } else {
                baseStyle = "flex items-center justify-center rounded-xl border border-blue-400 bg-blue-500/80 text-white shadow-[0_0_25px_rgba(59,130,246,0.8)] scale-90 z-10 transition-all duration-75 ";
            }
        } else {
            // Aktif değilken solarak kaybolması için transition ekliyoruz (özellikle hatalar için)
            baseStyle += " transition-all duration-1000 ease-out ";
        }

        return baseStyle + widthStr;
    };


    return (
        <div className="max-w-4xl mx-auto mt-8 flex flex-col items-center gap-2 select-none">
            {keyboardLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-row justify-center gap-1 sm:gap-2 w-full">
                    {row.map((key) => (
                        <div key={key} className={getKeyStyle(key)}>
                            {key === 'space' ? '' : key === 'şhift' ? 'Shift' : key}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// Vite HMR cache invalidation
export default VirtualKeyboard;
