import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Calendar, Clock, TrendingUp, Globe } from "lucide-react";

const TMDB_KEY = "2dca580c2a14b55200e784d157207b4d";
const IMG_BASE = "https://image.tmdb.org/t/p/w780";

interface MovieDetail {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: { id: number; name: string }[];
  spoken_languages: { english_name: string }[];
  budget: number;
  revenue: number;
  popularity: number;
  status: string;
  homepage: string | null;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieModalProps {
  movieId: number | null;
  onClose: () => void;
}

const MovieModal = ({ movieId, onClose }: MovieModalProps) => {
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&language=en-US`).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_KEY}&language=en-US`).then(r => r.json()),
    ])
      .then(([movieData, creditsData]) => {
        setDetail(movieData);
        setCast(creditsData.cast?.slice(0, 8) ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [movieId]);

  if (!movieId) return null;

  const year = detail?.release_date?.split("-")[0] || "N/A";
  const formatMoney = (n: number) =>
    n > 0 ? `$${(n / 1_000_000).toFixed(1)}M` : "N/A";

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-2 text-foreground backdrop-blur transition-colors hover:bg-surface-hover"
          >
            <X className="h-5 w-5" />
          </button>

          {loading || !detail ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Backdrop */}
              {detail.backdrop_path && (
                <div className="relative h-56 w-full overflow-hidden sm:h-72">
                  <img
                    src={`${IMG_BASE}${detail.backdrop_path}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-6">
                {/* Title + tagline */}
                <div>
                  <h2 className="font-display text-3xl tracking-wider sm:text-4xl text-foreground">
                    {detail.title}
                  </h2>
                  {detail.tagline && (
                    <p className="mt-1 text-sm italic text-primary">
                      "{detail.tagline}"
                    </p>
                  )}
                </div>

                {/* Meta badges */}
                <div className="flex flex-wrap gap-2">
                  {detail.genres.map((g) => (
                    <span
                      key={g.id}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatItem icon={<Star className="h-4 w-4 text-primary" />} label="Rating" value={`${detail.vote_average.toFixed(1)} (${detail.vote_count})`} />
                  <StatItem icon={<Calendar className="h-4 w-4 text-primary" />} label="Year" value={year} />
                  <StatItem icon={<Clock className="h-4 w-4 text-primary" />} label="Runtime" value={detail.runtime ? `${detail.runtime} min` : "N/A"} />
                  <StatItem icon={<TrendingUp className="h-4 w-4 text-primary" />} label="Popularity" value={detail.popularity.toFixed(0)} />
                </div>

                {/* Overview */}
                <div>
                  <h3 className="mb-2 font-display text-lg tracking-wider text-foreground">OVERVIEW</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {detail.overview || "No overview available."}
                  </p>
                </div>

                {/* Financial */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <StatItem icon={<Globe className="h-4 w-4 text-primary" />} label="Status" value={detail.status} />
                  <StatItem label="Budget" value={formatMoney(detail.budget)} />
                  <StatItem label="Revenue" value={formatMoney(detail.revenue)} />
                </div>

                {/* Cast */}
                {cast.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-display text-lg tracking-wider text-foreground">TOP CAST</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {cast.map((c) => (
                        <div key={c.id} className="flex items-center gap-3 rounded-lg bg-secondary p-2">
                          {c.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${c.profile_path}`}
                              alt={c.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                              {c.name[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-foreground">{c.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{c.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {detail.spoken_languages?.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground">Languages:</span>{" "}
                    {detail.spoken_languages.map((l) => l.english_name).join(", ")}
                  </p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const StatItem = ({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-lg bg-secondary p-3">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
      {icon}
      {label}
    </div>
    <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
  </div>
);

export default MovieModal;
