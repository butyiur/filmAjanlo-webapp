package hu.attila.filmajanlo.repository;

import hu.attila.filmajanlo.model.Movie;
import hu.attila.filmajanlo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByCategoryId(Long categoryId);

    // Saját filmek keresése (ha később kell)
    List<Movie> findByOwner(User owner);

    @Query(value = """
SELECT m FROM Movie m
WHERE (:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%')))
  AND (:director IS NULL OR LOWER(m.director) LIKE LOWER(CONCAT('%', :director, '%')))
  AND (:categoryId IS NULL OR m.category.id = :categoryId)
  AND (:yearFrom IS NULL OR m.releaseYear >= :yearFrom)
  AND (:yearTo IS NULL OR m.releaseYear <= :yearTo)
""",
            countQuery = """
SELECT COUNT(m) FROM Movie m
WHERE (:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%')))
  AND (:director IS NULL OR LOWER(m.director) LIKE LOWER(CONCAT('%', :director, '%')))
  AND (:categoryId IS NULL OR m.category.id = :categoryId)
  AND (:yearFrom IS NULL OR m.releaseYear >= :yearFrom)
  AND (:yearTo IS NULL OR m.releaseYear <= :yearTo)
""")
    Page<Movie> searchPaged(
            @Param("title") String title,
            @Param("director") String director,
            @Param("categoryId") Long categoryId,
            @Param("yearFrom") Integer yearFrom,
            @Param("yearTo") Integer yearTo,
            Pageable pageable
    );
}