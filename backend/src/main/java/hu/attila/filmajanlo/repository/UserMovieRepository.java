package hu.attila.filmajanlo.repository;

import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.model.UserMovie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserMovieRepository extends JpaRepository<UserMovie, Long> {
    @Query("SELECT DISTINCT m FROM UserMovie m WHERE m.owner = :owner")
    List<UserMovie> findByOwner(@Param("owner") User owner);
}