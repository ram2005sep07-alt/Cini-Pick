import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clapperboard } from "lucide-react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import { fetchGenres, discoverMovies, Genre, Movie } from "@/lib/tmdb";

const Index = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    fetchGenres().then(setGenres).catch(console.error);
  }, []);

  const handleSearch = async (genreId: number, year?: number) => {
    setIsLoading(true);
    setSearched(true);
    try {
      const results = await discoverMovies(genreId, year);
      setMovies(results);
    } catch (err) {
      console.error(err);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl tracking-wider sm:text-7xl">
            FIND YOUR {" "}
            <span className="text-gradient-gold">FAVORITE MOVIE </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Select a genre and optionally a year to get personalized movie
            recommendations powered by TMDB.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-2xl">
          <FilterBar genres={genres} onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 pb-20">
        {isLoading && (
          <div className="flex justify-center py-20">
            <Clapperboard className="h-10 w-10 animate-pulse-gold text-primary" />
          </div>
        )}

        {!isLoading && movies.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} onClick={() => setSelectedMovieId(movie.id)} />
            ))}
          </div>
        )}

        {!isLoading && searched && movies.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">
            No movies found. Try a different genre or year.
          </p>
        )}
      </section>

      <MovieModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
    </div>
  );
};

export default Index;
