import React, { useState } from 'react'
import { X, Save, Loader2, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import type { MediaType, MediaItem } from '../types'

interface EditMediaModalProps {
  item: MediaItem
  onClose: () => void
  // Retorna a obra atualizada ou nulo se ela foi excluída, além da ação realizada
  onSuccess: (updatedItem: MediaItem, action: 'update' | 'delete') => void
}

export function EditMediaModal({ item, onClose, onSuccess }: EditMediaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // O formulário já nasce preenchido com os dados da obra selecionada
  const [formData, setFormData] = useState({
    title: item.title,
    type: item.type,
    status: item.status,
    rating: item.rating ? item.rating.toString() : '',
    coverUrl: item.coverUrl,
    genres: (item.genres || []).join(', '),
  })

  const [details, setDetails] = useState<Record<string, string | number>>((item.details as unknown as Record<string, string | number>) || {});

  const handleUpdate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const genresArray = formData.genres.split(',').map(g => g.trim()).filter(g => g.length > 0)
    const ratingValue = formData.rating ? parseInt(formData.rating) : null

    const updatedMedia = {
      title: formData.title,
      type: formData.type,
      status: formData.status,
      rating: ratingValue,
      coverUrl: formData.coverUrl,
      genres: genresArray,
      details: details,
    }

    try {
      const { data, error } = await supabase
        .from('medias')
        .update(updatedMedia)
        .eq('id', item.id) // Atualiza apenas a obra com este ID exato
        .select()

      if (error) throw error
      if (data && data.length > 0) {
        onSuccess(data[0] as MediaItem, 'update')
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error)
      alert("Houve um erro ao atualizar a obra. Verifique o console.")
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleDelete = async () => {
    // Alerta de confirmação nativo do navegador
    if (!window.confirm(`Tem certeza que deseja excluir "${item.title}" do seu acervo?`)) {
      return
    }
    
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('medias')
        .delete()
        .eq('id', item.id)

      if (error) throw error
      onSuccess(item, 'delete')
    } catch (error) {
      console.error("Erro ao excluir:", error)
      alert("Houve um erro ao excluir a obra.")
    } finally {
      setIsDeleting(false)
    }
  };

  const renderDynamicFields = () => {
    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
    const handleChange = (field: string, value: string | number) => setDetails(prev => ({ ...prev, [field]: value }))

    switch (formData.type) {
      case 'anime':
        return (
          <>
            <div><label className="text-sm text-slate-400 mb-1 block">Estúdio</label><input type="text" value={details.studio || ''} className={inputClass} onChange={(e) => handleChange('studio', e.target.value)} required /></div>
            <div><label className="text-sm text-slate-400 mb-1 block">Plataforma</label><input type="text" value={details.platform || ''} className={inputClass} onChange={(e) => handleChange('platform', e.target.value)} required /></div>
            <div><label className="text-sm text-slate-400 mb-1 block">Episódios</label><input type="number" value={details.totalEpisodes || ''} className={inputClass} onChange={(e) => handleChange('totalEpisodes', parseInt(e.target.value))} required /></div>
          </>
        );
      case 'book':
        return (
          <>
            <div className="col-span-2"><label className="text-sm text-slate-400 mb-1 block">Autor</label><input type="text" value={details.author || ''} className={inputClass} onChange={(e) => handleChange('author', e.target.value)} required /></div>
            <div><label className="text-sm text-slate-400 mb-1 block">Páginas</label><input type="number" value={details.totalPages || ''} className={inputClass} onChange={(e) => handleChange('totalPages', parseInt(e.target.value))} required /></div>
          </>
        );
      case 'manga':
        return (
          <>
            <div className="col-span-2"><label className="text-sm text-slate-400 mb-1 block">Autor</label><input type="text" value={details.author || ''} className={inputClass} onChange={(e) => handleChange('author', e.target.value)} required /></div>
            <div><label className="text-sm text-slate-400 mb-1 block">Capítulos</label><input type="number" value={details.totalChapters || ''} className={inputClass} onChange={(e) => handleChange('totalChapters', parseInt(e.target.value))} required /></div>
          </>
        );
      case 'series':
        return (
          <>
            <div className="col-span-2"><label className="text-sm text-slate-400 mb-1 block">Plataforma</label><input type="text" value={details.platform || ''} className={inputClass} onChange={(e) => handleChange('platform', e.target.value)} required /></div>
            <div><label className="text-sm text-slate-400 mb-1 block">Episódios</label><input type="number" value={details.totalEpisodes || ''} className={inputClass} onChange={(e) => handleChange('totalEpisodes', parseInt(e.target.value))} required /></div>
          </>
        );
    }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full">
          <X size={20} />
        </button>

        <form onSubmit={handleUpdate} className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Editar Obra</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Título</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">URL da Capa</label>
                <input type="url" required value={formData.coverUrl} onChange={(e) => setFormData({...formData, coverUrl: e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Gêneros (separados por vírgula)</label>
                <input type="text" value={formData.genres} onChange={(e) => setFormData({...formData, genres: e.target.value})} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Tipo</label>
                <select value={formData.type} onChange={(e) => { setFormData({...formData, type: e.target.value as MediaType}); setDetails({}); }} className={inputClass}>
                  <option value="anime">Anime</option>
                  <option value="book">Livro</option>
                  <option value="manga">Mangá</option>
                  <option value="series">Série</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as MediaItem['status']})} className={inputClass}>
                  <option value="planned">Planejado</option>
                  <option value="in_progress">Consumindo</option>
                  <option value="completed">Concluído</option>
                  <option value="on_hold">Pausado</option>
                  <option value="dropped">Abandonado</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Nota (1 a 5)</label>
                <input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className={inputClass} placeholder="Opcional" />
              </div>
            </div>

            <hr className="border-slate-700 my-4" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Detalhes Específicos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderDynamicFields()}
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            {/* Botão de Excluir */}
            <button 
              type="button" 
              onClick={handleDelete} 
              disabled={isDeleting || isSubmitting} 
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              Excluir
            </button>

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting || isDeleting} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}