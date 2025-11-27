package hu.attila.filmajanlo;

import hu.attila.filmajanlo.model.Category;
import hu.attila.filmajanlo.model.Movie;
import hu.attila.filmajanlo.repository.CategoryRepository;
import hu.attila.filmajanlo.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FilmAjanloBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FilmAjanloBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(MovieRepository movieRepo, CategoryRepository categoryRepo) {
		return args -> {

			Category action = new Category();
			action.setName("Action");
			action.setDescription("Action movies");
			categoryRepo.save(action);

			Category scifi = new Category();
			scifi.setName("Sci-Fi");
			scifi.setDescription("Science fiction films");
			categoryRepo.save(scifi);

			Movie m1 = new Movie();
			m1.setTitle("Inception");
			m1.setDirector("Christopher Nolan");
			m1.setReleaseYear(2010);
			m1.setGenre("Sci-Fi");
			m1.setRating(8.8);
			m1.setDescription("A mind-bending thriller about dream infiltration.");
			m1.setImageUrl("https://image.url/inception.jpg");
			m1.setCategory(scifi);
			movieRepo.save(m1);

			Movie m2 = new Movie();
			m2.setTitle("John Wick");
			m2.setDirector("Chad Stahelski");
			m2.setReleaseYear(2014);
			m2.setGenre("Action");
			m2.setRating(7.4);
			m2.setDescription("Legendary assassin returns to get revenge.");
			m2.setImageUrl("https://image.url/johnwick.jpg");
			m2.setCategory(action);
			movieRepo.save(m2);
		};
	}
}
