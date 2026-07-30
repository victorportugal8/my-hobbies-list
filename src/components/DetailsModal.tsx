import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { MediaItem } from '../types'

interface DetailsModalProps {
  item: MediaItem
  onClose: () => void
}

export function DetailsModal({ item, onClose }: DetailsModalProps) {
    // Impede que o clique dentro do modal feche ele (event bubbling)
    const handleModalClick = (e: React.MouseEvent) => e.stopPropagation()

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
                className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                onClick={handleModalClick}
            >
                {/* Capa Lateral */}
                <div className="md:w-2/5 h-64 md:h-auto bg-slate-800">
                    <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Conteúdo */}
                <div className="p-6 md:w-3/5 flex flex-col relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-bold text-white mb-6 pr-10">{item.title}</h2>

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