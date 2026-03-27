import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { resetToTest, startReplay } from "../store/WordSlice";
import VirtualKeyboard from "./VirtualKeyboard";

function InformationArea() {

    const dispatch = useDispatch();
    const isReplaying = useSelector((state: RootState) => state.words.isReplaying);
    const correctCount = useSelector((state: RootState) => state.words.correctWord);
    const rejectCount = useSelector((state: RootState) => state.words.rejectWord);
    const testMode = useSelector((state: RootState) => state.words.testMode);
    const elapsedTime = useSelector((state: RootState) => state.words.elapsedTime);
    const correctKeystrokes = useSelector((state: RootState) => state.words.correctKeystrokes);
    const totalKeystrokes = useSelector((state: RootState) => state.words.totalKeystrokes);

    const minutes = elapsedTime > 0 ? elapsedTime / 60 : 1;
    const wpm = Math.max(0, Math.floor((totalKeystrokes / 5) / minutes));
    const kpm = Math.max(0, Math.floor(totalKeystrokes / minutes));
    const accuracy = totalKeystrokes > 0 ? Math.floor((correctKeystrokes / totalKeystrokes) * 100) : 100;

    let titleText = "Sonuç";
    if (testMode === '1min') titleText = "1 Dakikalık Test Sonucu";
    else if (testMode === '3min') titleText = "3 Dakikalık Test Sonucu";
    else titleText = "Süresiz Test Sonucu";

    return (
        <div className="max-w-300 mx-auto w-full my-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center text-white p-10 rounded-3xl shadow-2xl animate-[InformationAnimate_1s]">
                <h1 className="text-4xl pb-6 font-black tracking-tight text-blue-400">{titleText}</h1>
                <div className="px-4 text-center mt-2 flex flex-wrap justify-center gap-10">
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Hız (WPM)</span>
                        <span className="text-5xl font-black text-green-400">{wpm}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Doğruluk</span>
                        <span className="text-5xl font-black text-yellow-400">%{accuracy}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Doğru</span>
                        <span className="text-5xl font-black text-green-500">{correctCount}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Yanlış Kelime</span>
                        <span className="text-5xl font-black text-red-500">{rejectCount}</span>
                    </div>
                </div>
                
                {/* İkinci Satır İstatistikler (Tuş Vuruşları) */}
                <div className="px-4 text-center mt-8 flex flex-wrap justify-center gap-10">
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Tuş / Dakika (KPM)</span>
                        <span className="text-4xl font-black text-purple-400">{kpm}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Doğru Tuş</span>
                        <span className="text-4xl font-black text-green-500">{correctKeystrokes}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Toplam Tuş</span>
                        <span className="text-4xl font-black text-blue-300">{totalKeystrokes}</span>
                    </div>
                </div>

                <div className="flex gap-4 mt-10">
                    <button 
                        onClick={() => dispatch(resetToTest())} 
                        className="bg-white/10 border border-white/20 rounded-2xl px-10 py-4 cursor-pointer hover:bg-white hover:text-[#001529] transition-all duration-300 font-black uppercase tracking-widest text-sm shadow-xl" 
                        type="button"
                    >
                        Tekrar Dene
                    </button>
                    <button 
                        onClick={() => dispatch(startReplay())} 
                        disabled={isReplaying}
                        className={`border rounded-2xl px-10 py-4 font-black uppercase tracking-widest text-sm shadow-xl transition-all duration-300 ${isReplaying ? 'bg-purple-500/50 text-white cursor-not-allowed border-purple-400/50 animate-pulse' : 'bg-purple-600/20 text-purple-300 border-purple-500/30 cursor-pointer hover:bg-purple-500 hover:text-white'}`} 
                        type="button"
                    >
                        {isReplaying ? "İzleniyor..." : "Tekrarı İzle (20sn)"}
                    </button>
                </div>
            </div>
            
            {/* Sanal Klavye Sonuç Ekranı Açıkken Burada Gözükür */}
            <div className={`mt-8 ${isReplaying ? 'opacity-100 scale-100' : 'opacity-80 scale-95'} transition-all duration-500`}>
                <VirtualKeyboard />
            </div>

        </div>
    )
}

// Vite HMR cache invalidation
export default InformationArea;