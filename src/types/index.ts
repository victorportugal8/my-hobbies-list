// Tipos literais(valores exatos que serão permitidos)
export type MediaType = 'anime' | 'book' | 'manga' | 'series'
export type MediaStatus = 'completed' | 'in_progress' | 'planned' | 'on_hold' | 'dropped'
// Propriedades compartilhadas entre os tipos de mídia
export interface BaseMedia{
    id: string
    title: string
    type: MediaType
    status: MediaStatus
    rating: number | null
    favorite?: boolean
    coverUrl: string
    genres?: string[]
    completedAt?: string | null
    reviewQuote?: string
}
//Detalhes específicos de cada tipo de mídia
export interface AnimeDetails{
    platform: string
    studio: string
    totalEpisodes: number
}
export interface BookDetails {
  author: string
  totalPages: number
}

export interface MangaDetails {
  author: string
  totalChapters: number
}

export interface SeriesDetails {
  platform: string
  totalEpisodes: number
}
//Unindo os tipos de mídia com seus detalhes específicos
export type MediaItem =
    | (BaseMedia & { type: 'anime'; details: AnimeDetails })
    | (BaseMedia & { type: 'book'; details: BookDetails })
    | (BaseMedia & { type: 'manga'; details: MangaDetails })
    | (BaseMedia & { type: 'series'; details: SeriesDetails })