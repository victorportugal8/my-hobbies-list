import { useState, useMemo } from 'react'
import { LayoutGrid, Tv, Book, BookOpen, Film, Search } from 'lucide-react'
import { MediaCard } from './components/MediaCard'
import { DetailsModal } from './components/DetailsModal'
import type { MediaItem, MediaType } from './types'

// Simulando o mock JSON
  const mockData: MediaItem[] = [
    {
    id: "anime-1",
    title: "Sousou no Frieren",
    type: "anime",
    status: "completed",
    rating: 5,
    coverUrl: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
    details: { platform: "Crunchyroll", studio: "Madhouse", totalEpisodes: 28 }
    },
    {
      id: "book-1",
      title: "Duna",
      type: "book",
      status: "in_progress",
      rating: null,
      coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81zN7udGRUL.jpg",
      details: { author: "Frank Herbert", totalPages: 680 }
    },
    {
      id: "manga-1",
      title: "Vagabond",
      type: "manga",
      status: "on_hold",
      rating: 5,
      coverUrl: "https://cdn.myanimelist.net/images/manga/1/259070l.jpg",
      details: { author: "Takehiko Inoue", totalChapters: 327 }
    },
    {
      id: "series-1",
      title: "Ruptura (Severance)",
      type: "series",
      status: "planned",
      rating: null,
      coverUrl: "https://image.tmdb.org/t/p/w500/8csaai0k3uR0V0X6G422y5jHthd.jpg",
      details: { platform: "Apple TV+", totalEpisodes: 19 }
    }
  ]

  //Configuração das abas de filtro
  const TABS = [
    { id: 'all', label: 'Todos', icon: LayoutGrid },
    { id: 'anime', label: 'Animes', icon: Tv },
    { id: 'book', label: 'Livros', icon: Book },
    { id: 'manga', label: 'Mangás', icon: BookOpen },
    { id: 'series', label: 'Séries', icon: Film },
  ] as const
  type TabType = MediaType | 'all'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  //Lógica do filtro
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/*Cabeçalho*/}
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white">Meu Hub de Hobbies</h1>
          <p className="text-slate-400 mt-2">Meu catálogo pessoal de mídias.</p>
        </header>
        {/* Barra de pesquisa */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
        {/* Navegação de Abas */}
          <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          {/* Input de Busca */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        {/* Grid responsivo: 2 colunas mobile, 3 tablet, 4 desktop */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredData.map((item) => (
              <MediaCard 
                key={item.id}
                title={item.title}
                type={item.type}
                status={item.status}
                rating={item.rating}
                coverUrl={item.coverUrl}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Search size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-slate-300 mb-2">Nenhuma obra encontrada</h2>
            <p>Tente buscar com outros termos ou mude a aba de categoria.</p>
          </div>
        )}
      </div>
      {selectedItem && (
        <DetailsModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}
export default App;