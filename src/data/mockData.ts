import type { MediaItem } from '../types'

export const mockData: MediaItem[] = [
  {
  id: "anime-1",
  title: "Sousou no Frieren",
  type: "anime",
  status: "completed",
  rating: 5,
  coverUrl: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
  genres: ["Fantasia", "Aventura", "Slice of Life"],
  details: { platform: "Crunchyroll", studio: "Madhouse", totalEpisodes: 28 }
  },
  {
    id: "book-1",
    title: "Duna",
    type: "book",
    status: "in_progress",
    rating: null,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81zN7udGRUL.jpg",
    genres: ["Sci-Fi", "Política"],
    details: { author: "Frank Herbert", totalPages: 680 }
  },
  {
    id: "manga-1",
    title: "Vagabond",
    type: "manga",
    status: "on_hold",
    rating: 5,
    coverUrl: "https://cdn.myanimelist.net/images/manga/1/259070l.jpg",
    genres: ["Histórico", "Ação", "Drama"],
    details: { author: "Takehiko Inoue", totalChapters: 327 }
  },
  {
    id: "series-1",
    title: "Ruptura (Severance)",
    type: "series",
    status: "planned",
    rating: null,
    coverUrl: "https://image.tmdb.org/t/p/w500/8csaai0k3uR0V0X6G422y5jHthd.jpg",
    genres: ["Thriller", "Mistério"],
    details: { platform: "Apple TV+", totalEpisodes: 19 }
  }
]