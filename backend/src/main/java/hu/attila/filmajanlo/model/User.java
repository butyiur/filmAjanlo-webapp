package hu.attila.filmajanlo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role = "USER";

    // --- ÚJ: a user saját filmjei ---
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Movie> movies;
}