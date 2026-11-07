import React from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { PlayerDock } from './components/layout/PlayerDock';
import { HomeView } from './components/views/HomeView';
import { ExploreView } from './components/views/ExploreView';
import { GenreDetailView } from './components/views/GenreDetailView';
import { TrackDetailView } from './components/views/TrackDetailView';
import { StudioDspView } from './components/views/StudioDspView';
import { LibraryView } from './components/views/LibraryView';
import { PlaylistDetailView } from './components/views/PlaylistDetailView';
import { AlbumDetailView } from './components/views/AlbumDetailView';
import { SettingsView } from './components/views/SettingsView';
import { SleepTimerModal } from './components/modals/SleepTimerModal';
import { QueueDrawer } from './components/modals/QueueDrawer';
import { CreatePlaylistModal } from './components/modals/CreatePlaylistModal';
import { ImportPlaylistModal } from './components/modals/ImportPlaylistModal';
import { ToastContainer } from './components/modals/ToastContainer';
import { AudioController } from './components/audio/AudioController';
import { usePlayerStore } from './store/usePlayerStore';

export const App: React.FC = () => {
  const { activeTab } = usePlayerStore();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExploreView />;
      case 'genre-detail':
        return <GenreDetailView />;
      case 'track-detail':
        return <TrackDetailView />;
      case 'studio-dsp':
        return <StudioDspView />;
      case 'library':
        return <LibraryView />;
      case 'playlist-detail':
        return <PlaylistDetailView />;
      case 'album-detail':
        return <AlbumDetailView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0E0D12] text-[#F8FAFC] flex overflow-hidden p-3 sm:p-5 gap-5">
      {/* Headless Web Audio API 10-Band EQ Engine & Desktop Keyboard Shortcuts */}
      <AudioController />

      {/* Left Navigation Sidebar (Desktop) & Bottom Nav (Mobile) */}
      <Sidebar />

      {/* Main Content & Bottom Player Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full justify-between gap-3">
        {/* Top Universal Search, Live Results Popover & Profile Bar */}
        <TopBar />

        {/* Scrollable Active Screen Viewport */}
        <main className="flex-1 overflow-y-auto pr-1 pb-32 md:pb-2">
          {renderActiveView()}
        </main>

        {/* Persistent Sticky Bottom Player Dock */}
        <PlayerDock />
      </div>

      {/* Focused Action Modals, Drawers & Global Toast Notification */}
      <SleepTimerModal />
      <QueueDrawer />
      <CreatePlaylistModal />
      <ImportPlaylistModal />
      <ToastContainer />
    </div>
  );
};

export default App;
