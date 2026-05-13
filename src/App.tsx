import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import InformationArea from "./components/InformationArea"
import InputArea from "./components/InputArea"
import WordArea from "./components/WordArea"
import RealTimeStats from "./components/RealTimeStats"
import VirtualKeyboard from "./components/VirtualKeyboard"
import DurationTabs from "./components/DurationTabs"
import type { RootState } from "./store/store"
import { resetToTest, toggleTheme } from "./store/WordSlice"

function App() {

  const isComplete = useSelector((state : RootState) => state.words.isComplete);
  const theme = useSelector((state: RootState) => state.words.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    // Sync theme to root element for Tailwind 4 class-based dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // ANTI-CHEAT
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        dispatch(resetToTest());
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
    <div className="min-h-screen font-sans flex flex-col justify-center py-10 px-4 md:px-8 selection:bg-neutral-900 dark:selection:bg-neutral-100 selection:text-white dark:selection:text-black">
      
      <div className="max-w-5xl w-full mx-auto flex justify-end mb-4">
          <button 
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-200"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            )}
          </button>
        </div>

        <DurationTabs />
        <RealTimeStats />
        
        {
          isComplete ? (
            <InformationArea />
          ) : null
        }
        
        <div className={isComplete ? "opacity-30 pointer-events-none mt-8 max-w-5xl mx-auto w-full transition-opacity duration-500" : "mt-8 max-w-5xl mx-auto w-full"}>
          <WordArea />
          <InputArea />
        </div>

        {!isComplete && (
          <div className="mt-12 w-full max-w-5xl mx-auto">
             <VirtualKeyboard />
          </div>
        )}

      </div>
  )
}

export default App
