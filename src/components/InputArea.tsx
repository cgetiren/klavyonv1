import { useDispatch, useSelector } from "react-redux";
import { calculateResult, checkWord, startTest, incrementKeystroke } from "../store/WordSlice";
import type { RootState } from "../store/store";

function InputArea() {
    const dispatch = useDispatch();
    const actionWord = useSelector((state: RootState) => state.words.actionWord);

    const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => { /* Inputa her değer girildiğinde kontrol eder */
        dispatch(startTest());
        let val = e.target.value;
        if(val.startsWith(" ")) val = val.trimStart(); // sol başındaki boşlukları al
        
        dispatch(checkWord(val.trim()));
    }

    const GetKey = (e: React.KeyboardEvent<HTMLInputElement>) => { /* Space tuşuna basıldığında doğru ve yanlışları hesaplar */
        if (e.code === "Space" && actionWord.trim() !== "") {
            dispatch(incrementKeystroke({ isCorrect: true })); // Space tuşunu da doğru sayabiliriz
            dispatch(calculateResult());
            e.preventDefault();
        } else if (e.code === "Backspace") {
            // Kullanıcı sildiğinde hatalı bir tuş basımı veya düzeltme olarak kabul edilir; toplam tuş basımına eklenir
            dispatch(incrementKeystroke({ isCorrect: false }));
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            <input 
                value={actionWord}
                onKeyDown={(e) => GetKey(e)} 
                onChange={(e) => changeInput(e)} 
                className="w-full border-b-2 border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 mt-8 px-0 py-6 font-bold text-5xl tracking-tight transition-all duration-300 placeholder-neutral-200 dark:placeholder-neutral-800" 
                autoFocus 
                type="text" 
                placeholder="Start typing..." 
            />
        </div>
    )
}

    export default InputArea;