package hu.attila.filmajanlo.controller;

import hu.attila.filmajanlo.model.Movie;
import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.model.UserMovie;
import hu.attila.filmajanlo.repository.MovieRepository;
import hu.attila.filmajanlo.repository.UserMovieRepository;
import hu.attila.filmajanlo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;



import java.util.List;

@RestController
@RequestMapping("/api/user/movies")
@RequiredArgsConstructor
public class UserMovieController {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final UserMovieRepository userMovieRepository;

    // Saját filmek lekérése
    @GetMapping
    public ResponseEntity<List<Movie>> getMyMovies(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow();

        List<Movie> movies = userMovieRepository.findByUser(user).stream()
                .map(UserMovie::getMovie)
                .toList();

        return ResponseEntity.ok(movies);
    }

    // Film hozzáadása saját listához
    @PostMapping("/{movieId}")
    public ResponseEntity<?> addToMyMovies(
            @PathVariable Long movieId,
            Authentication auth
    ) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow();

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        if (userMovieRepository.existsByUserAndMovie(user, movie)) {
            return ResponseEntity.badRequest().body("Movie already in your list");
        }

        UserMovie um = new UserMovie();
        um.setUser(user);
        um.setMovie(movie);
        userMovieRepository.save(um);

        return ResponseEntity.ok("Movie added to your list");
    }

    // Film törlése saját listából
    @DeleteMapping("/{movieId}")
    public ResponseEntity<?> removeFromMyMovies(
            @PathVariable Long movieId,
            Authentication auth
    ) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow();

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        UserMovie um = userMovieRepository.findByUserAndMovie(user, movie)
                .orElse(null);

        if (um == null) {
            return ResponseEntity.badRequest().body("Movie not in your list");
        }

        userMovieRepository.delete(um);
        return ResponseEntity.ok("Movie removed from your list");
    }
}