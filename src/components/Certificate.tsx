import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface CertificateProps {
    wpm: number;
    accuracy: number;
    testMode: string;
}

const Certificate = ({ wpm, accuracy, testMode }: CertificateProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useSelector((state: RootState) => state.words.theme);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas dimensions (Editorial Ratio)
        canvas.width = 800;
        canvas.height = 600;

        // Background
        ctx.fillStyle = theme === 'dark' ? '#121212' : '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border (Swiss Style)
        ctx.strokeStyle = theme === 'dark' ? '#F5F5F5' : '#171717';
        ctx.lineWidth = 20;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Thin inner border
        ctx.lineWidth = 1;
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

        // Typography
        const textColor = theme === 'dark' ? '#F5F5F5' : '#171717';
        const secondaryColor = theme === 'dark' ? '#525252' : '#A3A3A3';

        // Title
        ctx.fillStyle = textColor;
        ctx.font = '900 42px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TYPING PERFORMANCE', canvas.width / 2, 140);
        
        ctx.font = '400 14px Inter, sans-serif';
        ctx.fillStyle = secondaryColor;
        ctx.fillText('OFFICIAL CERTIFICATE OF COMPLETION', canvas.width / 2, 165);

        // Main Stats
        ctx.fillStyle = textColor;
        ctx.font = '900 140px Inter, sans-serif';
        ctx.fillText(wpm.toString(), canvas.width / 2, 340);
        
        ctx.font = '700 24px Inter, sans-serif';
        ctx.fillText('WORDS PER MINUTE', canvas.width / 2, 380);

        // Secondary Stats Grid
        ctx.font = '900 32px Inter, sans-serif';
        ctx.fillText(`${accuracy}%`, canvas.width / 2 - 100, 480);
        ctx.font = '400 12px Inter, sans-serif';
        ctx.fillStyle = secondaryColor;
        ctx.fillText('ACCURACY', canvas.width / 2 - 100, 500);

        ctx.fillStyle = textColor;
        ctx.font = '900 32px Inter, sans-serif';
        ctx.fillText(testMode.toUpperCase(), canvas.width / 2 + 100, 480);
        ctx.font = '400 12px Inter, sans-serif';
        ctx.fillStyle = secondaryColor;
        ctx.fillText('TEST MODE', canvas.width / 2 + 100, 500);

        // Date & Signature Area
        const date = new Date().toLocaleDateString();
        ctx.font = '700 14px Inter, sans-serif';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.fillText(`DATE: ${date}`, 80, 550);
        
        ctx.textAlign = 'right';
        ctx.fillText('KLAVYON V1 VERIFIED', canvas.width - 80, 550);

        // Swiss Red Accent
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(canvas.width / 2 - 30, 80, 60, 10);

    }, [wpm, accuracy, testMode, theme]);

    const downloadCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `klavyon-certificate-${wpm}wpm.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-3 group">
            <div className="relative overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                <canvas 
                    ref={canvasRef} 
                    className="w-[240px] h-[180px] md:w-[320px] md:h-[240px] cursor-pointer"
                    onClick={downloadCertificate}
                />
                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors pointer-events-none flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all duration-300">
                        Download PNG
                    </span>
                </div>
            </div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] bg-white/80 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded">
                Live Certificate
            </span>
        </div>
    );
};

export default Certificate;
