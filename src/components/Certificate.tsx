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

        // High DPI Support
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 1000 * dpr;
        canvas.height = 700 * dpr;
        ctx.scale(dpr, dpr);

        const width = 1000;
        const height = 700;

        // Background
        ctx.fillStyle = theme === 'dark' ? '#0A0A0A' : '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Premium Grid Background (Subtle)
        ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
        ctx.lineWidth = 1;
        for(let i=0; i<width; i+=40) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
        }
        for(let i=0; i<height; i+=40) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
        }

        // Main Frame
        ctx.strokeStyle = theme === 'dark' ? '#FFFFFF' : '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, width - 80, height - 80);

        // Colors
        const primaryColor = theme === 'dark' ? '#FFFFFF' : '#000000';
        const secondaryColor = theme === 'dark' ? '#A3A3A3' : '#737373';
        const accentColor = '#DC2626'; // Swiss Red

        // Header - Editorial Style
        ctx.fillStyle = primaryColor;
        ctx.font = '900 12px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('KLAVYON / PERFORMANCE PROTOCOL', 60, 75);
        
        ctx.textAlign = 'right';
        ctx.fillText('v1.0.0_STABLE', width - 60, 75);

        // Swiss Cross / Logo Minimal
        ctx.fillStyle = accentColor;
        ctx.fillRect(60, 110, 30, 8);
        ctx.fillRect(71, 99, 8, 30);

        // Main Title
        ctx.fillStyle = primaryColor;
        ctx.font = '900 82px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('CERTIFICATE', 60, 200);
        ctx.fillText('OF SPEED', 60, 280);

        // Separator Line
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(60, 320);
        ctx.lineTo(260, 320);
        ctx.stroke();

        // The Data - WPM
        ctx.font = '900 240px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(wpm.toString(), width - 60, 340);
        
        ctx.font = '900 24px Inter';
        ctx.fillText('WPM', width - 65, 370);

        // Info Grid
        ctx.textAlign = 'left';
        
        // Accuracy
        ctx.font = '400 12px Inter';
        ctx.fillStyle = secondaryColor;
        ctx.fillText('PRECISION RATE', 60, 450);
        ctx.font = '900 48px Inter';
        ctx.fillStyle = primaryColor;
        ctx.fillText(`${accuracy}%`, 60, 500);

        // Test Mode
        ctx.font = '400 12px Inter';
        ctx.fillStyle = secondaryColor;
        ctx.fillText('PROTOCOL MODE', 280, 450);
        ctx.font = '900 48px Inter';
        ctx.fillStyle = primaryColor;
        ctx.fillText(testMode.toUpperCase(), 280, 500);

        // Timestamp
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.font = '400 12px Inter';
        ctx.fillStyle = secondaryColor;
        ctx.fillText('ISSUED ON', 540, 450);
        ctx.font = '900 32px Inter';
        ctx.fillStyle = primaryColor;
        ctx.fillText(date.toUpperCase(), 540, 500);

        // Footer Metadata
        ctx.font = '400 10px Inter';
        ctx.fillStyle = secondaryColor;
        const metadata = `HASH: ${Math.random().toString(36).substring(2, 15).toUpperCase()} | AUTHENTICITY GUARANTEED BY KLAVYON ENGINE`;
        ctx.fillText(metadata, 60, height - 60);

        // Signature Line
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width - 260, height - 90);
        ctx.lineTo(width - 60, height - 90);
        ctx.stroke();
        
        ctx.textAlign = 'right';
        ctx.font = '900 12px Inter';
        ctx.fillStyle = primaryColor;
        ctx.fillText('SYSTEM VALIDATED', width - 60, height - 70);

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
