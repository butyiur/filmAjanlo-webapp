package hu.attila.filmajanlo.service;

import hu.attila.filmajanlo.model.Movie;
import java.util.List;

public interface MovieService {

    List<Movie> findAll();
    Movie findById(Long id);
    Movie save(Movie movie);
    Movie update(Long id, Movie movie);
    void delete(Long id);

    // megmaradhatnak a régi egyszerű keresők is
    List<Movie> searchByTitle(String title);
    List<Movie> findByCategory(Long categoryId);

    // ÚJ: rugalmas kereső – minden paraméter opcionális
    List<Movie> search(String title, String director, Long categoryId, Integer yearFrom, Integer yearTo);
}