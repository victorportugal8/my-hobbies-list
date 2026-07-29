import { Star, Tv, Book, BookOpen, Film } from 'lucide-react';
import type { MediaType, MediaStatus } from '../types';

interface MediaCardProps {
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating: number | null;
  coverUrl: string;
  onClick: () => void;
}

export function MediaCard({ title, type, status, rating, coverUrl, onClick }: MediaCardProps) {
  const getMediaIcon = () => {
    switch (type) {
      case 'anime': return <Tv size={16} />;
      case 'book': return <Book size={16} />;
      case 'manga': return <BookOpen size={16} />;
      case 'series': return <Film size={16} />;
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'completed': return { label: 'Concluído', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'in_progress': return { label: 'Consumindo', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'planned': return { label: 'Planejado', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case 'on_hold': return { label: 'Pausado', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
      case 'dropped': return { label: 'Abandonado', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    }
  };

  const renderStars = () => {
    if (rating === null) {
      return <span className="text-sm text-slate-500 italic">Não avaliado</span>;
    }

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400" 
                : "fill-transparent text-slate-600" 
            }
          />
        ))}
      </div>
    );
  };

  const statusConfig = getStatusConfig();

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 hover:border-slate-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden bg-slate-900">
        <img 
          src={coverUrl} 
          alt={`Capa de ${title}`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-black/80 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm p-1.5 rounded-md text-slate-200 border border-white/10">
          {getMediaIcon()}
        </div>
        
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-sm border ${statusConfig.color}`}>
          {statusConfig.label}
        </div>
      </div>

      <div className="p-4 flex flex-col grow justify-between gap-3">
        <h3 className="font-bold text-slate-100 text-lg leading-tight line-clamp-2" title={title}>
          {title}
        </h3>
        
        <div className="mt-auto">
          {renderStars()}
        </div>
      </div>
    </div>
  );
}