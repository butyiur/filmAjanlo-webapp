package hu.attila.filmajanlo;

import hu.attila.filmajanlo.model.Category;
import hu.attila.filmajanlo.model.Movie;
import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.repository.CategoryRepository;
import hu.attila.filmajanlo.repository.MovieRepository;
import hu.attila.filmajanlo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class FilmAjanloBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FilmAjanloBackendApplication.class, args);
	}

	// csak placeholder, ha később töltenél be filmeket/kategóriákat
	@Bean
	public CommandLineRunner dataLoader(MovieRepository movieRepo, CategoryRepository categoryRepo) {
		return args -> {
			// ide később alap filmeket vagy kategóriákat tehetünk
		};
	}

	@Bean
	CommandLineRunner initDefaultUsers(UserRepository userRepository, PasswordEncoder encoder) {
		return args -> {
			// ADMIN létrehozása, ha nem létezik
			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPasswordHash(encoder.encode("admin123"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("✅ Alap admin létrehozva: admin / admin123");
			} else {
				System.out.println("ℹ️ Admin user már létezik, nem hozom létre újra.");
			}

			// TESZTUSER létrehozása, ha nem létezik
			if (userRepository.findByUsername("tesztuser").isEmpty()) {
				User user = new User();
				user.setUsername("tesztuser");
				user.setPasswordHash(encoder.encode("teszt123"));
				user.setRole("USER");
				userRepository.save(user);
				System.out.println("✅ Tesztuser létrehozva (tesztuser / teszt123)");
			} else {
				System.out.println("ℹ️ Tesztuser már létezik, nem hozom létre újra.");
			}
		};
	}
}