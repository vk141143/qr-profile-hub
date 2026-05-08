'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface QRGeneratorProps {
  url: string;
  profileName?: string;
  foreground?: string;
  background?: string;
}

export default function QRGenerator({ url, profileName = 'profile', foreground = '#ffffff', background = '#1e1b4b' }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    if (!url || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 280,
      margin: 2,
      color: { dark: foreground, light: background },
      errorCorrectionLevel: 'H',
    }).then(() => {
      setDataUrl(canvasRef.current!.toDataURL('image/png'));
    });
  }, [url, foreground, background]);

  const downloadPNG = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${profileName}-qr.png`;
    a.click();
  };

  const downloadSVG = async () => {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      color: { dark: foreground, light: background },
      errorCorrectionLevel: 'H',
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${profileName}-qr.svg`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="p-4 rounded-2xl" style={{ background }}>
        <canvas ref={canvasRef} className="rounded-xl" />
      </div>
      <p className="text-xs text-white/40 text-center break-all max-w-[280px]">{url}</p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={downloadPNG}>
          <Download className="w-4 h-4" /> PNG
        </Button>
        <Button variant="secondary" size="sm" onClick={downloadSVG}>
          <Download className="w-4 h-4" /> SVG
        </Button>
      </div>
    </motion.div>
  );
}
