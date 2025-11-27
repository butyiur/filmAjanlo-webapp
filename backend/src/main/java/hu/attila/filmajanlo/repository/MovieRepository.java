package hu.attila.filmajanlo.repository;

import hu.attila.filmajanlo.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    // Keresés cím alapján (contains, case-insensitive)
    List<Movie> findByTitleContainingIgnoreCase(String title);

    // Kategória alapján listázás
    List<Movie> findByCategoryId(Long categoryId);

    @Query("""
SELECT m FROM Movie m
WHERE (:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%')))
  AND (:director IS NULL OR LOWER(m.director) LIKE LOWER(CONCAT('%', :director, '%')))
  AND (:categoryId IS NULL OR m.category.id = :categoryId)
  AND (:yearFrom IS NULL OR m.releaseYear >= :yearFrom)
  AND (:yearTo IS NULL OR m.releaseYear <= :yearTo)
""")
    List<Movie> search(
            @Param("title") String title,
            @Param("director") String director,
            @Param("categoryId") Long categoryId,
            @Param("yearFrom") Integer yearFrom,
            @Param("yearTo") Integer yearTo
    );

}

