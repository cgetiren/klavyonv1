import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateResult, checkWord, startTest, incrementKeystroke } from "../store/WordSlice";
import type { RootState } from "../store/store";

function InputArea() {
    const dispatch = useDispatch();
    const actionWord = useSelector((state: RootState) => state.words.actionWord);
    const isComplete = useSelector((state: RootState) => state.words.isComplete);
    const inputRef = useRef<HTMLInputElement>(null);

    // Otomatik Odaklanma: Sayfa tıklandığında veya yüklendiğinde inputa odakla
    useEffect(() => {
        const handleGlobalClick = () => {
            if (!isComplete) {
                inputRef.current?.focus();
            }
        };

        const handleGlobalKeydown = (e: KeyboardEvent) => {
            // Eğer odak inputta değilse ve kullanıcı yazı yazmaya çalışıyorsa odağı inputa çek
            if (document.activeElement !== inputRef.current && !isComplete) {
                // Özel tuşları (F5, F12, Tab vb.) odaklamadan muaf tutabiliriz
                if (e.key.length === 1 || e.key === "Backspace") {
                    inputRef.current?.focus();
                }
            }
        };

        window.addEventListener("click", handleGlobalClick);
        window.addEventListener("keydown", handleGlobalKeydown);
        
        // İlk yüklemede odakla
        inputRef.current?.focus();

        return () => {
            window.removeEventListener("click", handleGlobalClick);
            window.removeEventListener("keydown", handleGlobalKeydown);
        };
    }, [isComplete]);

    const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(startTest());
        let val = e.target.value;
        if(val.startsWith(" ")) val = val.trimStart();
        
        dispatch(checkWord(val.trim()));
    }

    const GetKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Space" && actionWord.trim() !== "") {
            dispatch(incrementKeystroke({ isCorrect: true }));
            dispatch(calculateResult());
            e.preventDefault();
        } else if (e.code === "Backspace") {
            dispatch(incrementKeystroke({ isCorrect: false }));
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            <input 
                ref={inputRef}
                value={actionWord}
                onKeyDown={(e) => GetKey(e)} 
                onChange={(e) => changeInput(e)} 
                className="w-full border-b-2 border-neutral-200 dark:border-neutral-800 bg-transparent text-[var(--swiss-text)] focus:outline-none focus:border-[var(--swiss-text)] mt-12 px-0 py-2 font-bold text-5xl tracking-tight transition-all duration-300 placeholder-neutral-200 dark:placeholder-neutral-800" 
                autoFocus 
                type="text" 
                placeholder="Start typing..." 
            />
        </div>
    )
}

    export default InputArea;