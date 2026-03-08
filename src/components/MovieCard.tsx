import { motion } from "framer-motion";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Star, Calendar } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  index: number;
  onClick: () => void;
}

const MovieCard = ({ movie, index, onClick }: MovieCardProps) => {
  const posterUrl = getImageUrl(movie.poster_path);
  const year = movie.release_date?.split("-")[0] || "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={onClick}
      className="group card-shine cursor-pointer rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 hover:border-gold-dim hover:glow-gold"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <span className="text-muted-foreground">No Poster</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg tracking-wide text-foreground line-clamp-1">
          {movie.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {year}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-primary" />
            {movie.vote_average.toFixed(1)}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {movie.overview || "No overview available."}
        </p>
      </div>
    </motion.div>
  );
};

export default MovieCard;
