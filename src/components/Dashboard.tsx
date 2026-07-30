import { Tv, Book, BookOpen, Film, LayoutGrid, CheckCircle2 } from 'lucide-react'
import type { MediaItem } from '../types'

interface DashboardProps {
  items: MediaItem[]
}

export function Dashboard({ items }: DashboardProps) {
    // Lógica para contar os dados
    const stats ={
        total: items.length,
        completed: items.filter(item => item.status === 'completed').length,
        anime: items.filter(item => item.type === 'anime').length,
        book: items.filter(item => item.type === 'book').length,
        manga: items.filter(item => item.type === 'manga').length,
        series: items.filter(item => item.type === 'series').length,
    }
    // Component para renderizar os cards do dashboard
    const StatCard = ({ title, count, icon: Icon, colorClass }: { title: string, count: number, icon: any, colorClass: string }) => (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                <p className="text-2xl font-bold text-white">{count}</p>
            </div>
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
    )
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard 
                title="Total" 
                count={stats.total} 
                icon={LayoutGrid} 
                colorClass="bg-slate-700 text-slate-300" 
            />
            <StatCard 
                title="Concluídos" 
                count={stats.completed} 
                icon={CheckCircle2} 
                colorClass="bg-emerald-500/20 text-emerald-400" 
            />
            <StatCard 
                title="Animes" 
                count={stats.anime} 
                icon={Tv} 
                colorClass="bg-blue-500/20 text-blue-400" 
            />
            <StatCard 
                title="Livros" 
                count={stats.book} 
                icon={Book} 
                colorClass="bg-amber-500/20 text-amber-400" 
            />
            <StatCard 
                title="Mangás" 
                count={stats.manga} 
                icon={BookOpen} 
                colorClass="bg-purple-500/20 text-purple-400" 
            />
            <StatCard 
                title="Séries" 
                count={stats.series} 
                icon={Film} 
                colorClass="bg-rose-500/20 text-rose-400" 
            />
        </div>
  )
}