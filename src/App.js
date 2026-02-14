/**
 * PETUNJUK DEPLOY KE VERCEL:
 * 1. Pastikan Anda memiliki Node.js terinstal.
 * 2. Buat folder baru, jalankan: npx create-react-app my-ai-app
 * 3. Instal dependencies: npm install lucide-react
 * 4. Salin kode di bawah ini ke src/App.js
 * 5. Untuk Tailwind CSS, pastikan sudah terkonfigurasi di proyek Anda.
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Glasses, 
  Mic, 
  Send, 
  Loader2, 
  Download, 
  Image as ImageIcon,
  Info,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  // API Config - Masukkan API Key Anda di sini atau gunakan Environment Variable
  const apiKey = ""; 
  const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

  const generateImage = async (text) => {
    const activePrompt = text || prompt;
    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: activePrompt }],
          parameters: { sampleCount: 1 }
        }),
      });

      if (!response.ok) throw new Error("Gagal terhubung ke AI.");
      
      const result = await response.json();
      const base64Data = result.predictions?.[0]?.bytesBase64Encoded;
      
      if (base64Data) {
        setGeneratedImage(`data:image/png;base64,${base64Data}`);
      } else {
        throw new Error("Hasil tidak ditemukan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat membuat gambar. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickAction = (actionText) => {
    setPrompt(actionText);
    if (actionText === "Buat gambar") {
      // Hanya set prompt agar user bisa menambahkan detail
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background Image with Blur Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2070&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center">
        
        {/* Greeting Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-white text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Selamat pagi, Kita
          </h1>
          <h2 className="text-white text-4xl md:text-5xl font-semibold tracking-tight mt-2">
            Apa yang bisa saya bantu hari ini?
          </h2>
        </div>

        {/* Result Area (Conditional) */}
        { (generatedImage || isGenerating || error) && (
          <div className="w-full mb-6 bg-[#1e1f2b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl animate-in zoom-in-95 duration-300">
            {isGenerating ? (
              <div className="h-64 flex flex-col items-center justify-center text-white/70 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
                <p className="text-sm font-medium animate-pulse">Sedang memproses permintaan Anda...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-300 italic text-sm">{error}</div>
            ) : (
              <div className="relative group rounded-2xl overflow-hidden">
                <img src={generatedImage} alt="AI Result" className="w-full max-h-[400px] object-contain bg-black/20" />
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = "ai-image.png";
                    link.click();
                  }}
                  className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white transition-all shadow-lg"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Input Box Area */}
        <div className="w-full relative group">
          <div className="bg-[#1e1f2b] border border-white/10 rounded-[28px] shadow-2xl p-4 transition-all focus-within:ring-1 focus-within:ring-white/20">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tanyakan apa saja"
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 resize-none h-14 pt-2 px-2 text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  generateImage();
                }
              }}
            />
            
            <div className="flex items-center justify-between mt-4 px-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#2d2e3c] hover:bg-[#3d3e4c] rounded-full px-3 py-1.5 cursor-pointer transition-colors border border-white/5">
                  <div className="w-5 h-5 bg-gradient-to-tr from-orange-400 via-red-500 to-purple-600 rounded-md mr-2 flex items-center justify-center overflow-hidden">
                    <Sparkles className="text-white w-3 h-3" />
                  </div>
                  <span className="text-white text-sm font-medium">Smart</span>
                  <ChevronDown className="text-gray-400 w-4 h-4 ml-1" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Plus className="w-6 h-6" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Glasses className="w-6 h-6" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Mic className="w-6 h-6" />
                </button>
                {prompt.trim() && (
                   <button 
                    onClick={() => generateImage()}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full transition-all"
                   >
                    <Send className="w-4 h-4" />
                   </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            "Tulis draf pertama",
            "Dapatkan saran",
            "Pelajari sesuatu yang baru",
            "Buat gambar",
            "Buat rencana"
          ].map((text) => (
            <button
              key={text}
              onClick={() => handleQuickAction(text)}
              className="px-5 py-2.5 rounded-full bg-[#1e1f2b]/60 hover:bg-[#1e1f2b]/90 border border-white/10 text-white text-sm transition-all backdrop-blur-sm"
            >
              {text}
            </button>
          ))}
        </div>
      </main>

      {/* Footer Bottom Bar */}
      <footer className="absolute bottom-6 w-full px-10 flex flex-col items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl justify-center">
          <div className="flex items-center justify-between bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex-1 cursor-pointer hover:bg-black/40 transition-all">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-gray-300" />
              <span className="text-white text-sm font-medium">Kembali ke file Anda</span>
            </div>
            <Info className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center justify-between bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex-1 cursor-pointer hover:bg-black/40 transition-all">
            <div className="flex items-center gap-3">
              <Glasses className="w-5 h-5 text-gray-300" />
              <span className="text-white text-sm font-medium leading-tight">Dapatkan bantuan terpandu dengan aplikasi Anda</span>
            </div>
            <Info className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <p className="text-[10px] text-gray-400 mt-6 text-center">
          Copilot dapat membuat kesalahan. Percakapan Anda dipersonalisasi dan membantu melatih AI. <span className="underline cursor-pointer">Tolak</span>.
        </p>
      </footer>
    </div>
  );
};

export default App;