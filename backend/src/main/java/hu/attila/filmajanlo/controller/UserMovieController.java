package hu.attila.filmajanlo.controller;

import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.model.UserMovie;
import hu.attila.filmajanlo.repository.UserMovieRepository;
import hu.attila.filmajanlo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserMovieController {

    private final UserMovieRepository userMovieRepository;
    private final UserRepository userRepository;

    // --- Saját filmek lekérése + szűrők ---
    @GetMapping
    public List<UserMovie> getMyMovies(
            @AuthenticationPrincipal UserDetails details,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String director,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo
    ) {
        User user = userRepository.findByUsername(details.getUsername()).orElseThrow();
        List<UserMovie> movies = userMovieRepository.findByOwner(user);

        return movies.stream()
                .filter(m -> search == null || m.getTitle().toLowerCase().contains(search.toLowerCase()))
                .filter(m -> director == null || (m.getDirector() != null &&
                        m.getDirector().toLowerCase().contains(director.toLowerCase())))
                .filter(m -> category == null || (m.getCategory() != null &&
                        m.getCategory().getName().equalsIgnoreCase(category)))
                .filter(m -> yearFrom == null || m.getReleaseYear() >= yearFrom)
                .filter(m -> yearTo == null || m.getReleaseYear() <= yearTo)
                .collect(Collectors.toList());
    }

    // --- Saját film hozzáadása ---
    @PostMapping
    public UserMovie addMovie(@AuthenticationPrincipal UserDetails details, @RequestBody UserMovie movie) {
        User user = userRepository.findByUsername(details.getUsername()).orElseThrow();
        movie.setOwner(user);
        return userMovieRepository.save(movie);
    }

    // --- Saját film szerkesztése ---
    @PutMapping("/{id}")
    public UserMovie updateMovie(
            @AuthenticationPrincipal UserDetails details,
            @PathVariable Long id,
            @RequestBody UserMovie updated
    ) {
        User user = userRepository.findByUsername(details.getUsername()).orElseThrow();
        UserMovie existing = userMovieRepository.findById(id).orElseThrow();

        if (!existing.getOwner().getId().equals(user.getId()))
            throw new RuntimeException("Not your movie!");

        existing.setTitle(updated.getTitle());
        existing.setDirector(updated.getDirector());
        existing.setReleaseYear(updated.getReleaseYear());
        existing.setGenre(updated.getGenre());
        existing.setRating(updated.getRating());
        existing.setDescription(updated.getDescription());
        existing.setPosterUrl(updated.getPosterUrl());
        existing.setCategory(updated.getCategory());

        return userMovieRepository.save(existing);
    }

    // --- Saját film törlése ---
    @DeleteMapping("/{id}")
    public void deleteMovie(@AuthenticationPrincipal UserDetails details, @PathVariable Long id) {
        User user = userRepository.findByUsername(details.getUsername()).orElseThrow();
        UserMovie existing = userMovieRepository.findById(id).orElseThrow();

        if (!existing.getOwner().getId().equals(user.getId()))
            throw new RuntimeException("Not your movie!");

        userMovieRepository.delete(existing);
    }

    @GetMapping("/{id}")
    public UserMovie getMyMovieById(@AuthenticationPrincipal UserDetails details, @PathVariable Long id) {
        User user = userRepository.findByUsername(details.getUsername()).orElseThrow();
        UserMovie movie = userMovieRepository.findById(id).orElseThrow();

        if (!movie.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Not your movie!");
        }

        return movie;
    }
}