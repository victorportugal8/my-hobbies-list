import { X, Tv, Book, BookOpen, Film } from 'lucide-react'
import { motion } from 'framer-motion'
import type { MediaItem, MediaStatus } from '../types'

interface StatusSummaryModalProps {
  status: MediaStatus
  items: MediaItem[]
  onClose: () => void
}

export function StatusSummaryModal({ status, items, onClose }: StatusSummaryModalProps) {
  // Filtra as obras apenas pelo status selecionado
  const filteredItems = items.filter(item => item.status === status)

  // Conta quantas obras existem de cada tipo dentro desse status
  const counts = {
    anime: filteredItems.filter(i => i.type === 'anime').length,
    series: filteredItems.filter(i => i.type === 'series').length,
    book: filteredItems.filter(i => i.type === 'book').length,
    manga: filteredItems.filter(i => i.type === 'manga').length,
  }

  // Lógica dinâmica para os verbos baseada no tipo da obra
  const getDynamicVerb = (type: string) => {
    const isWatchable = type === 'anime' || type === 'series'
    switch (status) {
      case 'planned': return isWatchable ? 'para Assistir' : 'para Ler'
      case 'in_progress': return isWatchable ? 'Assistindo' : 'Lendo'
      case 'completed': return 'Concluídos'
      case 'on_hold': return 'Pausados'
      case 'dropped': return 'Abandonados'
      default: return ''
    }
  }

  // Agrupa as categorias e ignora as que têm contagem zero
  const categories = [
    { id: 'anime', label: 'Animes', icon: Tv, count: counts.anime, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'series', label: 'Séries', icon: Film, count: counts.series, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'book', label: 'Livros', icon: Book, count: counts.book, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'manga', label: 'Mangás', icon: BookOpen, count: counts.manga, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  ].filter(cat => cat.count > 0)

  const getStatusTitle = () => {
    switch (status) {
      case 'planned': return 'Planejados'
      case 'in_progress': return 'Consumindo'
      case 'completed': return 'Concluídos'
      case 'on_hold': return 'Pausados'
      case 'dropped': return 'Abandonados'
      default: return 'Detalhes'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }} 
        className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl relative overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Resumo: {getStatusTitle()}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-6 text-slate-400 border border-dashed border-slate-700 rounded-xl bg-slate-800/50">
              Nenhuma obra com este status.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {categories.map(cat => (
                <div key={cat.id} className={`flex items-center justify-between p-4 rounded-xl border ${cat.color}`}>
                  <div className="flex items-center gap-3">
                    <cat.icon size={20} />
                    <span className="font-semibold">{cat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-xl leading-none mb-1">{cat.count}</span>
                    <span className="text-xs opacity-80">{getDynamicVerb(cat.id)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}