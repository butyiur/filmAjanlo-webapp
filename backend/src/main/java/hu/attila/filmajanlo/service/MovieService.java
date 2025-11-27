package hu.attila.filmajanlo.service;

import hu.attila.filmajanlo.model.Movie;
import java.util.List;

public interface MovieService {

    List<Movie> findAll();
    Movie findById(Long id);
    Movie save(Movie movie);
    Movie update(Long id, Movie movie);
    void delete(Long id);

    List<Movie> searchByTitle(String title);
    List<Movie> findByCategory(Long categoryId);
}