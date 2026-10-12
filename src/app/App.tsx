import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '@/shared/ui/Navbar';
import { Footer } from '@/shared/ui/Footer';
import { AppRouter } from './router';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0a0d14] text-slate-100 selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};
