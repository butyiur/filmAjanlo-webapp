package hu.attila.filmajanlo.repository;

import hu.attila.filmajanlo.model.Movie;
import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.model.UserMovie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserMovieRepository extends JpaRepository<UserMovie, Long> {

    List<UserMovie> findByUser(User user);

    boolean existsByUserAndMovie(User user, Movie movie);

    Optional<UserMovie> findByUserAndMovie(User user, Movie movie);
}