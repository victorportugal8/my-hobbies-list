import React from 'react'
import { Tv, Book, BookOpen, Film, LayoutGrid, CheckCircle2, PlayCircle, Calendar, PauseCircle, XCircle } from 'lucide-react'
import type { MediaItem } from '../types'

interface StatCardProps {
  title: string
  count: number
  icon: React.ElementType
  colorClass: string
  onClick?: () => void
}

const StatCard = ({ title, count, icon: Icon, colorClass, onClick }: StatCardProps) => (
  <div 
    onClick={onClick}
    className={`bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between ${
      onClick ? 'cursor-pointer hover:bg-slate-700 hover:border-slate-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300' : ''
    }`}
  >
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{count}</p>
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={20} />
    </div>
  </div>
)

interface DashboardProps {
  items: MediaItem[]
  onStatusClick: (status: MediaItem['status']) => void
}

export function Dashboard({ items, onStatusClick }: DashboardProps) {
  // Calculando todos os dados necessários
  const stats = {
    total: items.length,
    anime: items.filter(item => item.type === 'anime').length,
    book: items.filter(item => item.type === 'book').length,
    manga: items.filter(item => item.type === 'manga').length,
    series: items.filter(item => item.type === 'series').length,
    
    // Status
    completed: items.filter(item => item.status === 'completed').length,
    in_progress: items.filter(item => item.status === 'in_progress').length,
    planned: items.filter(item => item.status === 'planned').length,
    on_hold: items.filter(item => item.status === 'on_hold').length,
    dropped: items.filter(item => item.status === 'dropped').length,
  }

  return (
    <div className="mb-10 flex flex-col gap-6">
      
      {/* Linha 1: Volume do Acervo */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Acervo por Mídia</h2>
        {/* Usando grid-cols-2 no mobile e grid-cols-5 no desktop para os 5 itens encaixarem perfeitamente */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total" count={stats.total} icon={LayoutGrid} colorClass="bg-slate-700 text-slate-300" />
          <StatCard title="Animes" count={stats.anime} icon={Tv} colorClass="bg-blue-500/20 text-blue-400" />
          <StatCard title="Livros" count={stats.book} icon={Book} colorClass="bg-amber-500/20 text-amber-400" />
          <StatCard title="Mangás" count={stats.manga} icon={BookOpen} colorClass="bg-purple-500/20 text-purple-400" />
          <StatCard title="Séries" count={stats.series} icon={Film} colorClass="bg-rose-500/20 text-rose-400" />
        </div>
      </div>

      {/* Linha 2: Status do Acervo */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Status Atual</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Concluídos" count={stats.completed} icon={CheckCircle2} colorClass="bg-emerald-500/20 text-emerald-400" onClick={() => onStatusClick('completed')} />
          <StatCard title="Consumindo" count={stats.in_progress} icon={PlayCircle} colorClass="bg-blue-500/20 text-blue-400" onClick={() => onStatusClick('in_progress')} />
          <StatCard title="Planejados" count={stats.planned} icon={Calendar} colorClass="bg-yellow-500/20 text-yellow-400" onClick={() => onStatusClick('planned')} />
          <StatCard title="Pausados" count={stats.on_hold} icon={PauseCircle} colorClass="bg-orange-500/20 text-orange-400" onClick={() => onStatusClick('on_hold')} />
          <StatCard title="Abandonados" count={stats.dropped} icon={XCircle} colorClass="bg-red-500/20 text-red-400" onClick={() => onStatusClick('dropped')} />
        </div>
      </div>

    </div>
  )
}