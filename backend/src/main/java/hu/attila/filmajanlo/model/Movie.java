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

    private int year;

    private String genre;

    private double rating;

    @Column(length = 2000)
    private String description;

    private String imageUrl;
}