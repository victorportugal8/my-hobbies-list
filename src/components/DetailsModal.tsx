import { X, Edit2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { MediaItem } from '../types'

interface DetailsModalProps {
  item: MediaItem
  onClose: () => void
  onEdit?: () => void
}

export function DetailsModal({ item, onClose, onEdit }: DetailsModalProps) {
    // Impede que o clique dentro do modal feche ele
    const handleModalClick = (e: React.MouseEvent) => e.stopPropagation()
    
    // Função para pegar o texto do status baseado no tipo
    const getStatusText = (status: string, type: string) => {
        const isWatchable = type === 'anime' || type === 'series'
        switch (status) {
            case 'planned': return isWatchable ? 'Assistir' : 'Ler'
            case 'in_progress': return isWatchable ? 'Assistindo' : 'Lendo'
            case 'completed': return 'Concluído'
            case 'on_hold': return 'Pausado'
            case 'dropped': return 'Abandonado'
            default: return status
        }
    }
    // Função para pegar a cor do status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'planned': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'on_hold': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            case 'dropped': return 'bg-red-500/20 text-red-400 border-red-500/30'
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
        }
    }

    // Função que decide o que renderizar baseado no TIPO da mídia
    const renderSpecificDetails = () => {
        switch (item.type) {
            case 'anime':
            return (
                <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800 p-3 rounded-lg"><span className="text-slate-400 block">Estúdio</span> {item.details.studio}</div>
                <div className="bg-slate-800 p-3 rounded-lg"><span className="text-slate-400 block">Episódios</span> {item.details.totalEpisodes}</div>
                <div className="bg-slate-800 p-3 rounded-lg col-span-2"><span className="text-slate-400 block">Plataforma</span> {item.details.platform}</div>
                </div>
            )
            case 'book':
            return (
                <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800 p-3 rounded-lg col-span-2"><span className="text-slate-400 block">Autor</span> {item.details.author}</div>
                <div className="bg-slate-800 p-3 rounded-lg"><span className="text-slate-400 block">Páginas</span> {item.details.totalPages}</div>
                </div>
            )
            case 'manga':
            return (
                <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800 p-3 rounded-lg col-span-2"><span className="text-slate-400 block">Autor</span> {item.details.author}</div>
                <div className="bg-slate-800 p-3 rounded-lg"><span className="text-slate-400 block">Capítulos</span> {item.details.totalChapters}</div>
                </div>
            )
            case 'series':
            return (
                <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800 p-3 rounded-lg"><span className="text-slate-400 block">Plataforma</span> {item.details.platform}</div>
                <div className="bg-slate-800 p-3 rounded-lg"><span className="text-slate-400 block">Episódios</span> {item.details.totalEpisodes}</div>
                </div>
            )
        }
    }
    return (
        // Fundo escuro animado (fade in/out)
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
        >
            {/* Caixa do Modal animada (efeito de mola/zoom) */}
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                onClick={handleModalClick}
            >
                {/* BOTÕES DE AÇÃO DO MODAL */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                
                {/* Botão de Editar */}
                {onEdit && (
                    <button 
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                    }} 
                    className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm p-2 rounded-full transition-colors shadow-lg"
                    title="Editar Obra"
                    >
                    <Edit2 size={18} />
                    </button>
                )}
                    {/* Botão de Fechar */}
                    <button 
                        onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                        }} 
                        className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm p-2 rounded-full transition-colors shadow-lg"
                        title="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>
                {/* Capa Lateral */}
                <div className="md:w-2/5 h-64 md:h-auto bg-slate-800">
                    <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Conteúdo */}
                <div className="p-6 md:w-3/5 flex flex-col relative">
                    <h2 className="text-2xl font-bold text-white mb-6 pr-10">{item.title}</h2>
                    {/* Tag renderizando o status dinâmico logo abaixo do título */}
                    <div className="mb-4">
                        <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status, item.type)}
                        </span>
                    </div>
                    {/* Adicionando os gêneros aqui */}
                    {item.genres && item.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                        {item.genres.map((genre, index) => (
                            <span 
                            key={index} 
                            className="px-2.5 py-1 bg-slate-800 text-blue-400 text-xs font-semibold rounded-md border border-slate-700"
                            >
                            {genre}
                            </span>
                        ))}
                        </div>
                    )}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Detalhes da Obra</h3>
                        {renderSpecificDetails()}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}