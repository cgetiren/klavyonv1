import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import confetti from 'canvas-confetti';

interface CertificateProps {
    wpm: number;
    accuracy: number;
    testMode: string;
}

const Certificate = ({ wpm, accuracy, testMode }: CertificateProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useSelector((state: RootState) => state.words.theme);

    useEffect(() => {
        // Trigger celebration
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = 800 * dpr;
        canvas.height = 600 * dpr;
        ctx.scale(dpr, dpr);

        const width = 800;
        const height = 600;

        if (theme === 'artdeco') {
            // Art Deco Background
            ctx.fillStyle = '#011627';
            ctx.fillRect(0, 0, width, height);

            // Gold Geometric Frame
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 2;
            
            // Double Border
            ctx.strokeRect(20, 20, width - 40, height - 40);
            ctx.strokeRect(35, 35, width - 70, height - 70);

            // Sunburst Corners
            const drawSunburst = (x: number, y: number, rotation: number) => {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotation);
                ctx.beginPath();
                for(let i=0; i<5; i++) {
                    ctx.moveTo(0, 0);
                    ctx.lineTo(60, -20 + i*10);
                }
                ctx.stroke();
                ctx.restore();
            };

            drawSunburst(20, 20, 0);
            drawSunburst(width-20, 20, Math.PI/2);
            drawSunburst(width-20, height-20, Math.PI);
            drawSunburst(20, height-20, -Math.PI/2);

            const textColor = '#D4AF37';
            ctx.textAlign = 'center';
            ctx.fillStyle = textColor;
            
            ctx.font = '300 24px Inter, serif';
            ctx.fillText('GRANDEUR PERFORMANCE', width / 2, 100);

            ctx.font = '900 160px Inter, serif';
            ctx.fillText(wpm.toString(), width / 2, 320);
            
            ctx.font = '700 20px Inter, serif';
            ctx.fillText('WORDS PER MINUTE', width / 2, 360);

            ctx.font = '400 36px Inter, serif';
            ctx.fillText(`PRECISION: ${accuracy}%`, width / 2, 460);

            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            ctx.font = '300 12px Inter, serif';
            ctx.fillText(`ISSUED ON ${date.toUpperCase()}`, width / 2, 530);
            ctx.fillText('THE KLAVYON ESTATE • VERIFIED', width / 2, 550);

        } else {
            // Apple Style Background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            if (theme === 'dark') {
                gradient.addColorStop(0, '#2C2C2E');
                gradient.addColorStop(1, '#1C1C1E');
            } else if (theme === 'retro') {
                gradient.addColorStop(0, '#000000');
                gradient.addColorStop(1, '#1A001A');
            } else {
                gradient.addColorStop(0, '#F5F5F0'); // Muted Ivory
                gradient.addColorStop(1, '#EDECE4'); // Softer shadow tone
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Subtle Glow / Mesh
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = theme === 'dark' ? '#0A84FF' : theme === 'retro' ? '#00F3FF' : '#B0A995'; 
            ctx.beginPath();
            ctx.arc(width * 0.8, 0, 500, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            const textColor = theme === 'dark' ? '#D1D1D6' : theme === 'retro' ? '#00F3FF' : '#3C3C3C';
            const subTextColor = theme === 'dark' ? '#8E8E93' : theme === 'retro' ? '#FF00E5' : '#A1A196';

            ctx.textAlign = 'center';
            ctx.fillStyle = textColor;
            ctx.font = '700 32px Inter, -apple-system, sans-serif';
            ctx.fillText('Typing Test Result', width / 2, 100);

            ctx.font = '900 180px Inter, -apple-system, sans-serif';
            ctx.fillText(wpm.toString(), width / 2, 320);
            
            ctx.font = '600 24px Inter, -apple-system, sans-serif';
            ctx.fillStyle = subTextColor;
            ctx.fillText('WORDS PER MINUTE', width / 2, 360);

            const statsY = 480;
            ctx.fillStyle = textColor;
            ctx.font = '700 48px Inter, -apple-system, sans-serif';
            ctx.fillText(`${accuracy}%`, width / 2 - 120, statsY);
            ctx.font = '500 14px Inter, -apple-system, sans-serif';
            ctx.fillStyle = subTextColor;
            ctx.fillText('ACCURACY', width / 2 - 120, statsY + 30);

            ctx.fillStyle = textColor;
            ctx.font = '700 48px Inter, -apple-system, sans-serif';
            ctx.fillText(testMode.toUpperCase(), width / 2 + 120, statsY);
            ctx.font = '500 14px Inter, -apple-system, sans-serif';
            ctx.fillStyle = subTextColor;
            ctx.fillText('TEST MODE', width / 2 + 120, statsY + 30);

            const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            ctx.font = '500 12px Inter, -apple-system, sans-serif';
            ctx.fillStyle = subTextColor;
            ctx.fillText(`Verified by Klavyon on ${date}`, width / 2, height - 50);

            ctx.fillStyle = '#007AFF';
            ctx.beginPath();
            ctx.arc(width / 2, 50, 4, 0, Math.PI * 2);
            ctx.fill();
        }

    }, [wpm, accuracy, testMode, theme]);

    const downloadCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `klavyon-result-${wpm}wpm.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    };

    return (
        <div className="fixed top-8 right-8 z-50 flex flex-col items-end gap-4 animate-[InformationAnimate_0.8s_ease-out]">
            <div className={`relative group overflow-hidden ${theme === 'artdeco' ? 'rounded-none border-2 border-[#D4AF37]' : 'rounded-[2rem] border border-white/20 dark:border-white/5'} shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.05] bg-white dark:bg-neutral-900`}>
                <canvas 
                    ref={canvasRef} 
                    className="w-[260px] h-[195px] md:w-[340px] md:h-[255px] cursor-pointer block"
                    onClick={downloadCertificate}
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 dark:group-hover:bg-white/5 transition-colors pointer-events-none" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`${theme === 'artdeco' ? 'bg-[#D4AF37] text-[#011627] rounded-none' : 'bg-black/80 text-white rounded-full backdrop-blur-md'} px-4 py-2 text-[10px] font-bold uppercase tracking-wider`}>
                        Save to Photos
                    </div>
                </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1 ${theme === 'artdeco' ? 'bg-[#011627] border border-[#D4AF37] rounded-none' : 'bg-white/50 backdrop-blur-md rounded-full border border-neutral-200/50'} shadow-sm`}>
                <div className={`w-2 h-2 rounded-full ${theme === 'artdeco' ? 'bg-[#D4AF37]' : 'bg-green-500'} animate-pulse`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'artdeco' ? 'text-[#D4AF37]' : 'text-neutral-500'}`}>
                    Live Score Card
                </span>
            </div>
        </div>
    );
};

export default Certificate;
