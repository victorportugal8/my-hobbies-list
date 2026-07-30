import { useState, useEffect, useMemo } from 'react'
import { LayoutGrid, Tv, Book, BookOpen, Film, Search, Loader2, Plus, Lock, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MediaCard } from './components/MediaCard'
import { DetailsModal } from './components/DetailsModal'
import { Dashboard } from './components/Dashboard'
import type { MediaItem, MediaType } from './types'
import { supabase } from './lib/supabase'
import { AddMediaModal } from './components/AddMediaModal'
import { LoginModal } from './components/LoginModal'
import type { Session } from '@supabase/supabase-js'

//Configuração das abas de filtro
const TABS = [
  { id: 'all', label: 'Todos', icon: LayoutGrid },
  { id: 'anime', label: 'Animes', icon: Tv },
  { id: 'book', label: 'Livros', icon: Book },
  { id: 'manga', label: 'Mangás', icon: BookOpen },
  { id: 'series', label: 'Séries', icon: Film },
] as const
type TabType = MediaType | 'all'
type SortOption = 'title-asc' | 'title-desc' | 'rating-desc' | 'rating-asc'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  // Estado da ordenação (Padrão: A-Z)
  const [sortBy, setSortBy] = useState<SortOption>('title-asc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // Estados dos Dados
  const [items, setItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // Busca os dados na nuvem
  useEffect(() => {
    async function fetchMedias() {
      try {
        // Pede para o Supabase trazer tudo da tabela 'medias'
        const { data, error } = await supabase
          .from('medias')
          .select('*')

        if (error) throw error
        
        // Se deu certo, salva no estado
        if (data) setItems(data as MediaItem[])
      } catch (error) {
        console.error("Erro ao buscar dados do Supabase:", error)
      } finally {
        setIsLoading(false) // Tira a tela de carregamento, dando erro ou não
      }
    }
    fetchMedias()

    // Verificação de login
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    // Observa mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Lógica de Filtragem e Ordenação
  const filteredData = useMemo(() => {
    // Filtrando as abas e a busca
    const result = items.filter((item) => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    })
    // Ordenando o que sobrou
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'rating-desc':
          // Se não tiver nota (null), joga para o final assumindo nota -1
          return (b.rating ?? -1) - (a.rating ?? -1);
        case 'rating-asc':
          // Se não tiver nota (null), joga para o final assumindo nota 999
          return (a.rating ?? 999) - (b.rating ?? 999);
        default:
          return 0;
      }
    });

    return result
  }, [activeTab, searchQuery, sortBy, items])

  // Tela de Carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="text-lg font-medium">Conectando ao banco de dados...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/*Cabeçalho*/}
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Meu Hub de Hobbies</h1>
            <p className="text-slate-400">Meu catálogo pessoal de mídias.</p>
          </div>
          
          <div className="flex gap-2">
            {session ? (
              <>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                  <Plus size={20} />
                  Nova Obra
                </button>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 rounded-xl transition-all"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-medium transition-all"
              >
                <Lock size={16} />
                Admin
              </button>
            )}
          </div>
        </header>
        {/* Dashboard de Estatísticas */}
        <Dashboard items={items} />
        {/* Barra de pesquisa */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
        {/* Navegação de Abas */}
          <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
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
          {/* Agrupamento da Busca e Ordenação */}
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            
            {/* Input de Busca */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Select de Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-800"
            >
              <option value="title-asc">A-Z</option>
              <option value="title-desc">Z-A</option>
              <option value="rating-desc">Maior Nota</option>
              <option value="rating-asc">Menor Nota</option>
            </select>
            
          </div>
        </div>
        {/* Grid responsivo: 2 colunas mobile, 3 tablet, 4 desktop */}
        {filteredData.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item) => (
                <motion.div
                  key={item.id}
                  layout // Permite que o card deslize para a nova posição
                  initial={{ opacity: 0, scale: 0.8 }} // Como ele nasce
                  animate={{ opacity: 1, scale: 1 }}   // Como ele fica na tela
                  exit={{ opacity: 0, scale: 0.8 }}    // Como ele morre
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <MediaCard 
                    title={item.title}
                    type={item.type}
                    status={item.status}
                    rating={item.rating}
                    coverUrl={item.coverUrl}
                    genres={item.genres}
                    onClick={() => setSelectedItem(item)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-slate-500"
          >
            <Search size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-slate-300 mb-2">Nenhuma obra encontrada</h2>
            <p>Tente buscar com outros termos ou mude a aba de categoria.</p>
          </motion.div>
        )}
      </div>
      {/* Envolvendo o modal no AnimatePresence */}
      <AnimatePresence>
        {selectedItem && (
          <DetailsModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
        {isAddModalOpen && session && (
          <AddMediaModal 
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={(newItem) => {
              // Adiciona o item novo no início do estado local sem precisar recarregar a página
              setItems(prevItems => [newItem, ...prevItems])
            }}
          />
        )}
        {/* Modal de Login */}
        {isLoginModalOpen && (
          <LoginModal onClose={() => setIsLoginModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
export default App;