import { useState } from 'react';
import { ActivePage } from './types';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { LeaderboardView } from './components/LeaderboardView';
import { AuthView } from './components/AuthView';
import { sounds } from './lib/sound';

function MainApp() {
  const [activePage, setActivePage] = useState<ActivePage>('game');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.isMuted = nextMuted;
  };

  return (
    <div className="min-h-screen bg-[#160b2b] text-[#eaddff] flex flex-col justify-between selection:bg-[#ec4899]/30 selection:text-[#ffb0cd]">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#ec4899]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[450px] h-[450px] bg-[#06b6d4]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#c084fc]/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col">
        {/* Navigation Header */}
        <Header
          activePage={activePage}
          onNavigate={setActivePage}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />

        {/* Main Content Pages */}
        <main className="flex-1 flex flex-col justify-center py-2">
          {activePage === 'game' && (
            <GameCard
              onViewLeaderboard={() => setActivePage('leaderboard')}
              onOpenAuth={() => setActivePage('auth')}
            />
          )}

          {activePage === 'leaderboard' && <LeaderboardView />}

          {activePage === 'auth' && (
            <AuthView onSuccessRedirect={() => setActivePage('game')} />
          )}
        </main>

        {/* Arcade Footer */}
        <footer className="w-full max-w-lg mx-auto px-4 py-4 text-center text-[11px] text-[#debec8]/60 border-t border-[#a68992]/10 relative z-10">
          <p>
            Guess It • Powered by Crypto Random Values &amp; Supabase
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
