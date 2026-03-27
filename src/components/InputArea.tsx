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
        <div className="max-w-300 mx-auto">
            <input 
                value={actionWord}
                onKeyDown={(e) => GetKey(e)} 
                onChange={(e) => changeInput(e)} 
                className="w-full border border-white/10 bg-white/5 backdrop-blur-md text-white focus:outline-none focus:border-blue-500/50 rounded-xl mt-4 px-4 py-3 font-bold text-2xl tracking-wider shadow-xl placeholder-white/20 transition-all duration-300" 
                autoFocus 
                type="text" 
                placeholder="Kelime Gir..." 
            />
        </div>
    )
}

export default InputArea;