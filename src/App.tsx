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
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'retro', 'artdeco');
    root.classList.add(theme);
    
    // Explicitly set background if needed
    if (theme === 'light') {
       root.style.backgroundColor = '#F5F5F0';
    } else if (theme === 'retro') {
       root.style.backgroundColor = '#000000';
    } else if (theme === 'artdeco') {
       root.style.backgroundColor = '#011627';
    } else {
       root.style.backgroundColor = '';
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
    <div className="min-h-screen font-sans flex flex-col justify-center py-10 px-4 md:px-8 selection:bg-neutral-900 dark:selection:bg-neutral-100 retro:selection:bg-[#00F3FF] artdeco:selection:bg-[#D4AF37] selection:text-white dark:selection:text-black retro:selection:text-black artdeco:selection:text-[#011627] transition-colors duration-500">
      
      <div className="max-w-5xl w-full mx-auto flex justify-end mb-4">
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="p-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 retro:hover:bg-neutral-900 artdeco:hover:bg-[#022137] transition-all duration-300 shadow-sm"
          title={`Switch to ${theme === 'light' ? 'Dark' : theme === 'dark' ? 'Retro' : theme === 'retro' ? 'Art Deco' : 'Light'} Theme`}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          ) : theme === 'retro' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF00E5]"><path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/><path d="M3 16.2V21m0 0h4.8M3 21l6-6"/><path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/><path d="M3 7.8V3m0 0h4.8M3 3l6 6"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
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
