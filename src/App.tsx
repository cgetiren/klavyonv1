import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import InformationArea from "./components/InformationArea"
import InputArea from "./components/InputArea"
import WordArea from "./components/WordArea"
import RealTimeStats from "./components/RealTimeStats"
import VirtualKeyboard from "./components/VirtualKeyboard"
import DurationTabs from "./components/DurationTabs"
import type { RootState } from "./store/store"
import { resetToTest } from "./store/WordSlice"

function App() {

  const isComplete = useSelector((state : RootState) => state.words.isComplete);
  const dispatch = useDispatch();

  useEffect(() => {
    // ANTI-CHEAT: F12, Sağ Tık (Inceleme), Ctrl+Shift+I gibi kısayolları engeller
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert("Hile Koruması: Sağ tık kullanılamaz.");
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        dispatch(resetToTest()); // Testi iptal et/sıfırla
        alert("Hile Koruması: Geliştirici araçlarına erişim engellendi. Testiniz sıfırlandı!");
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-br from-[#001529] to-[#012a5e] min-h-screen font-sans flex flex-col justify-center py-6 px-4">
      <DurationTabs />
      <RealTimeStats />
      
      {
        isComplete ? (
          <InformationArea />
        ) : null
      }
      
      <div className={isComplete ? "opacity-50 pointer-events-none mt-4" : "mt-4"}>
        <WordArea />
        <InputArea />
      </div>

      {!isComplete && (
        <div className="mt-8">
           <VirtualKeyboard />
        </div>
      )}

    </div>
  )
}

// Vite HMR cache invalidation
export default App
