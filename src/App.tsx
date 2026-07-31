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
import { EditMediaModal } from './components/EditMediaModal'
import type { Session } from '@supabase/supabase-js'

type TabType = MediaType | 'all'
type SortOption = 'title-asc' | 'title-desc' | 'rating-desc' | 'rating-asc'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  // Estado da ordenação (Padrão: A-Z)
  const [sortBy, setSortBy] = useState<SortOption>('title-asc')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // Estados dos Dados
  const [items, setItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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
      const matchesTab = activeTab === 'all' || item.type === activeTab
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      return matchesTab && matchesSearch && matchesStatus
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
  }, [activeTab, searchQuery, sortBy, statusFilter, items])

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
        {/* ÁREA DE CONTROLES: Abas e Filtros */}
          <div className="flex flex-col gap-5 mb-8">
            
            {/* LINHA 1: Abas de Tipo (Scroll horizontal suave apenas em telas muito pequenas) */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <button onClick={() => setActiveTab('all')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                <LayoutGrid size={18} /> Todos
              </button>
              <button onClick={() => setActiveTab('anime')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'anime' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                <Tv size={18} /> Animes
              </button>
              <button onClick={() => setActiveTab('book')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'book' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                <Book size={18} /> Livros
              </button>
              <button onClick={() => setActiveTab('manga')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'manga' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                <BookOpen size={18} /> Mangás
              </button>
              <button onClick={() => setActiveTab('series')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'series' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                <Film size={18} /> Séries
              </button>
            </div>

            {/* LINHA 2: Barra de Filtros (Busca + Status + Ordenação) */}
            <div className="flex flex-col xl:flex-row gap-3 xl:items-center justify-between bg-slate-800/30 p-3 rounded-2xl border border-slate-700/50">
              
              {/* Campo de Busca (Ocupa o espaço à esquerda) */}
              <div className="relative w-full xl:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar obras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-slate-500"
                />
              </div>
              
              {/* Selects de Filtro e Ordem (Agrupados à direita) */}
              <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-800"
                >
                  <option value="all">Todos os Status</option>
                  <option value="planned">Assistir / Ler</option>
                  <option value="in_progress">Assistindo / Lendo</option>
                  <option value="completed">Concluído</option>
                  <option value="on_hold">Pausado</option>
                  <option value="dropped">Abandonado</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-800"
                >
                  <option value="title-asc">A-Z</option>
                  <option value="title-desc">Z-A</option>
                  <option value="rating-desc">Maior Nota</option>
                  <option value="rating-asc">Menor Nota</option>
                </select>
              </div>
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
            onEdit={session ? () => setIsEditModalOpen(true) : undefined}
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
        {/* Modal de Edição */}
        {isEditModalOpen && selectedItem && session && (
          <EditMediaModal 
            item={selectedItem}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={(updatedItem, action) => {
              if (action === 'delete') {
                // Remove da lista
                setItems(prev => prev.filter(i => i.id !== updatedItem.id));
                // Fecha o modal de detalhes também
                setSelectedItem(null);
              } else {
                // Atualiza o item na lista
                setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
                // Atualiza os dados refletidos no modal de detalhes que está por trás
                setSelectedItem(updatedItem);
              }
              // Fecha o modal de edição
              setIsEditModalOpen(false);
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