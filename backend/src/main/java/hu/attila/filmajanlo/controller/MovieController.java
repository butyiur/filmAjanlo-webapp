package hu.attila.filmajanlo.controller;

import hu.attila.filmajanlo.model.Movie;
import hu.attila.filmajanlo.repository.MovieRepository;
import hu.attila.filmajanlo.service.MovieService;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*") // React miatt
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    // GET all movies
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.findAll();
    }

    // GET by ID
    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieService.findById(id);
    }

    // SEARCH by title
    // SEARCH /api/movies/search?title=&director=&categoryId=&yearFrom=&yearTo=
    @GetMapping("/search")
    public Page<Movie> searchMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String director,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            @PageableDefault(size = 10, sort = "releaseYear") Pageable pageable
    ) {
        return movieService.search(title, director, categoryId, yearFrom, yearTo, pageable);
    }

    // FILTER by category
    @GetMapping("/category/{categoryId}")
    public List<Movie> getMoviesByCategory(@PathVariable Long categoryId) {
        return movieService.findByCategory(categoryId);
    }


    // CREATE
    @PostMapping
    public Movie createMovie(@RequestBody Movie movie) {
        return movieService.save(movie);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Movie updateMovie(@PathVariable Long id, @RequestBody Movie movie) {
        return movieService.update(id, movie);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Long id) {
        movieService.delete(id);
    }


}