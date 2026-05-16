import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import data from "../data/data.json";


interface dataType {
    dataWords: string[],
    nextword: number,
    correctWord: number,
    rejectWord: number,
    pendingWord: number,
    actionWord: string,
    stateWord: string,
    isComplete: boolean,
    isStarted: boolean,
    startTime: number | null,
    elapsedTime: number,
    correctKeystrokes: number,
    incorrectKeystrokes: number,
    totalKeystrokes: number,
    testMode: '1min' | '3min' | 'infinite',
    timeRemaining: number | null,
    wordStatuses: Record<number, string>,
    keystrokeRecord: Array<{ key: string, timeOffset: number, isCorrect: boolean }>,
    isReplaying: boolean,
    theme: 'light' | 'dark' | 'retro' | 'artdeco'
}

const initialState: dataType = {
    dataWords: [],
    nextword: 0,
    correctWord: 0,
    rejectWord: 0,
    pendingWord: 0,
    actionWord: "",
    stateWord: "",
    isComplete: false,
    isStarted: false,
    startTime: null,
    elapsedTime: 0,
    correctKeystrokes: 0,
    incorrectKeystrokes: 0,
    totalKeystrokes: 0,
    testMode: '1min',
    timeRemaining: 60,
    wordStatuses: {},
    keystrokeRecord: [],
    isReplaying: false,
    theme: 'artdeco'
}

export const WordSlice = createSlice({
    name: 'WordSlice',
    initialState,
    reducers: {
        toggleTheme(state: dataType): void {
            if (state.theme === 'light') state.theme = 'dark';
            else if (state.theme === 'dark') state.theme = 'retro';
            else if (state.theme === 'retro') state.theme = 'artdeco';
            else state.theme = 'light';
        },
        getWords(state: dataType): void {
            const shuffled = [...data.kelimeler].sort(() => 0.5 - Math.random());
            const expandedList: string[] = [];
            for(let i=0; i<10; i++) { // 10 defa kopyalayarak bol miktarda kelime
                expandedList.push(...shuffled);
            }
            state.dataWords = expandedList;
            state.pendingWord = expandedList.length;
        },
        setTestMode(state: dataType, action: PayloadAction<'1min' | '3min' | 'infinite'>): void {
            state.testMode = action.payload;
            if(action.payload === '1min') state.timeRemaining = 60;
            else if(action.payload === '3min') state.timeRemaining = 180;
            else state.timeRemaining = null;
        },
        startTest(state: dataType): void {
            if (!state.isStarted) {
                state.isStarted = true;
                state.startTime = Date.now();
            }
        },
        tickTime(state: dataType): void {
            if (state.isStarted && !state.isComplete && state.startTime) {
                state.elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
                
                if (state.testMode !== 'infinite') {
                    const totalSecs = state.testMode === '1min' ? 60 : 180;
                    const currentRemaining = totalSecs - state.elapsedTime;
                    state.timeRemaining = currentRemaining > 0 ? currentRemaining : 0;
                    
                    if (state.timeRemaining === 0) {
                        state.isComplete = true; // süre bittiğinde testi bitir.
                    }
                }
            }
        },
        incrementKeystroke(state: dataType, action: PayloadAction<{isCorrect: boolean}>): void {
            if (state.isStarted && !state.isComplete) {
                state.totalKeystrokes += 1;
                if (action.payload.isCorrect) {
                    state.correctKeystrokes += 1;
                } else {
                    state.incorrectKeystrokes += 1;
                }

                // Son basılan fiziksel tuşun gerçek durumunu güncelle (Örn: Boşluk tuşu için)
                if (state.keystrokeRecord.length > 0) {
                    state.keystrokeRecord[state.keystrokeRecord.length - 1].isCorrect = action.payload.isCorrect;
                }
            }
        },
        recordKey(state: dataType, action: PayloadAction<{ key: string }>): void {
            if (state.isStarted && !state.isComplete && state.startTime && !state.isReplaying) {
                const timeOffset = Date.now() - state.startTime;
                // Varsayılan olarak doğru atanır, mili saniyeler sonra `checkWord` ve `incrementKeystroke` ile gerçek değeri güncellenir.
                state.keystrokeRecord.push({ key: action.payload.key, timeOffset, isCorrect: true });
            }
        },
        startReplay(state: dataType): void {
            state.isReplaying = true;
        },
        stopReplay(state: dataType): void {
            state.isReplaying = false;
        },
        checkWord(state: dataType, action: PayloadAction<string>): void {
            const currentTarget = state.dataWords[state.nextword];
            const newVal = action.payload;
            const oldVal = state.actionWord;

            if (state.isStarted && !state.isComplete) {
                // Sadece yeni eklenen karakterleri say
                if (newVal.length > oldVal.length) {
                    const addedStr = newVal.substring(oldVal.length);
                    for(let i=0; i < addedStr.length; i++) {
                        state.totalKeystrokes += 1;
                        const typedChar = addedStr[i];
                        const expectedChar = currentTarget ? currentTarget[oldVal.length + i] : undefined;
                        
                        const isCharCorrect = (typedChar === expectedChar);
                        if (isCharCorrect) {
                            state.correctKeystrokes += 1;
                        } else {
                            state.incorrectKeystrokes += 1;
                        }

                        if (state.keystrokeRecord.length > 0) {
                            state.keystrokeRecord[state.keystrokeRecord.length - 1].isCorrect = isCharCorrect;
                        }
                    }
                }
            }

            state.actionWord = newVal;

            let status = "default";
            if (state.actionWord === currentTarget) {
                status = "correct";
            } else if (state.actionWord.length > 0) {
                if (!currentTarget?.startsWith(state.actionWord)) {
                    status = "wrong";
                }
            }
            state.wordStatuses[state.nextword] = status;
        },
        calculateResult(state: dataType) {
            if(state.pendingWord <= 0 && state.dataWords.length > 0)
                return;            

            const currentTarget = state.dataWords[state.nextword];

            if (state.actionWord === currentTarget) {
                state.correctWord += 1;
                state.wordStatuses[state.nextword] = "correct";
            }
            else {
                state.rejectWord += 1;
                state.wordStatuses[state.nextword] = "wrong";
            }
            
            state.pendingWord -= 1;
            if (state.pendingWord < 1) {
                state.isComplete = true;
            }
            state.nextword += 1;
            state.actionWord = ""; 
        },
        resetToTest(state: dataType) {
            state.nextword = 0;
            state.correctWord = 0;
            state.rejectWord = 0;
            state.pendingWord = state.dataWords.length;
            state.actionWord = "";
            state.stateWord = "";
            state.isComplete = false;
            state.isStarted = false;
            state.startTime = null;
            state.elapsedTime = 0;
            state.correctKeystrokes = 0;
            state.incorrectKeystrokes = 0;
            state.totalKeystrokes = 0;
            state.wordStatuses = {};
            state.keystrokeRecord = [];
            state.isReplaying = false;

            if(state.testMode === '1min') state.timeRemaining = 60;
            else if(state.testMode === '3min') state.timeRemaining = 180;
            else state.timeRemaining = null;
        },
        finishTest(state: dataType) {
            if (!state.isComplete && state.isStarted) {
                if (state.actionWord.trim() !== "") {
                    const currentTarget = state.dataWords[state.nextword];
                    if (state.actionWord === currentTarget) {
                        state.correctWord += 1;
                        state.wordStatuses[state.nextword] = "correct";
                    } else {
                        state.rejectWord += 1;
                        state.wordStatuses[state.nextword] = "wrong";
                    }
                }
                state.isComplete = true;
                state.isStarted = false;
            }
        }
    },
})

export const { getWords, setTestMode, startTest, tickTime, incrementKeystroke, recordKey, startReplay, stopReplay, checkWord, calculateResult, resetToTest, finishTest, toggleTheme } = WordSlice.actions

// Vite HMR cache invalidation
export default WordSlice.reducer
