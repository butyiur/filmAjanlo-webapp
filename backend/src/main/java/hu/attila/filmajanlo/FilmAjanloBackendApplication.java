package hu.attila.filmajanlo;

import hu.attila.filmajanlo.model.Category;
import hu.attila.filmajanlo.model.Movie;
import hu.attila.filmajanlo.repository.CategoryRepository;
import hu.attila.filmajanlo.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;


@SpringBootApplication
public class FilmAjanloBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FilmAjanloBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(MovieRepository movieRepo, CategoryRepository categoryRepo) {
		return args -> {

		};
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder encoder) {
		return args -> {
			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPasswordHash(encoder.encode("admin"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("✅ Alap admin létrehozva: admin / admin");
			} else {
				System.out.println("ℹ️ Admin user már létezik, nem hozom létre újra.");
			}
		};
}
}
