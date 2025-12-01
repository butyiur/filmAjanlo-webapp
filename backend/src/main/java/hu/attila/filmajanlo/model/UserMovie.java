package hu.attila.filmajanlo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(
        name = "user_movies",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "movie_id"})
)
public class UserMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Kihez tartozik a listaelem
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    // Melyik film
    @ManyToOne(optional = false)
    @JoinColumn(name = "movie_id")
    private Movie movie;
}