package hu.attila.filmajanlo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String director;

    private int releaseYear;

    private String genre;

    private double rating;

    @Column(length = 2000)
    private String description;

    private String posterUrl;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // --- ÚJ: a film tulajdonosa (a user) ---
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}