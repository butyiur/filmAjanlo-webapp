package hu.attila.filmajanlo.service;

import hu.attila.filmajanlo.model.Movie;
import hu.attila.filmajanlo.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    public MovieServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public List<Movie> findAll() {
        return movieRepository.findAll();
    }

    @Override
    public Movie findById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
    }

    @Override
    public Movie save(Movie movie) {
        return movieRepository.save(movie);
    }

    @Override
    public Movie update(Long id, Movie movie) {
        Movie existing = findById(id);

        existing.setTitle(movie.getTitle());
        existing.setDirector(movie.getDirector());
        existing.setReleaseYear(movie.getReleaseYear());
        existing.setGenre(movie.getGenre());
        existing.setRating(movie.getRating());
        existing.setDescription(movie.getDescription());
        existing.setImageUrl(movie.getImageUrl());
        existing.setCategory(movie.getCategory());

        return movieRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        movieRepository.deleteById(id);
    }

    @Override
    public List<Movie> searchByTitle(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Movie> findByCategory(Long categoryId) {
        return movieRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<Movie> search(String title, String director, Long categoryId, Integer yearFrom, Integer yearTo) {
        String t  = (title != null && !title.isBlank()) ? title : null;
        String d  = (director != null && !director.isBlank()) ? director : null;
        Long c    = (categoryId != null && categoryId > 0) ? categoryId : null;
        Integer yf = (yearFrom != null) ? yearFrom : null;
        Integer yt = (yearTo   != null) ? yearTo   : null;
        return movieRepository.search(t, d, c, yf, yt);
    }
}