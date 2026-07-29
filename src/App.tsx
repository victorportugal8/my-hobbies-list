import { MediaCard} from './components/MediaCard'
import type { MediaItem} from './types'

function App() {
  // Simulando o mock JSON
  const mockData: MediaItem[] = [
    {
      id: "anime-1",
      title: "Sousou no Frieren",
      type: "anime",
      status: "completed",
      rating: 5,
      coverUrl: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
      details: {
        platform: "Crunchyroll",
        studio: "Madhouse",
        totalEpisodes: 28
      }
    },
    {
      id: "book-1",
      title: "Duna",
      type: "book" as const,
      status: "in_progress" as const,
      rating: null, // Testando a lógica de "Sem nota"
      coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81zN7udGRUL.jpg",
      details: {
        author: "Frank Herbert",
        totalPages: 412
      }
    },
    {
      id: "manga-1",
      title: "Vagabond",
      type: "manga" as const,
      status: "on_hold" as const,
      rating: 5,
      coverUrl: "https://cdn.myanimelist.net/images/manga/1/259070l.jpg",
      details: {
        author: "Takehiko Inoue",
        totalChapters: 327
      }
    },
    {
      id: "series-1",
      title: "Ruptura (Severance)",
      type: "series" as const,
      status: "planned" as const,
      rating: null,
      coverUrl: "https://image.tmdb.org/t/p/w500/8csaai0k3uR0V0X6G422y5jHthd.jpg",
      details: {
        platform: "Apple TV+",
        totalEpisodes: 10
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Meu Hub de Hobbies</h1>
          <p className="text-slate-400 mt-2">Meu catálogo pessoal de mídias.</p>
        </header>

        {/* Grid responsivo: 2 colunas mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockData.map((item) => (
            <MediaCard 
              key={item.id}
              title={item.title}
              type={item.type}
              status={item.status}
              rating={item.rating}
              coverUrl={item.coverUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;