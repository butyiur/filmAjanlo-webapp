package hu.attila.filmajanlo;

import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {

            if (userRepository.count() == 0) {
                User user = new User();
                user.setUsername("tesztuser");
                user.setPasswordHash(encoder.encode("teszt123"));
                user.setRole("USER");

                userRepository.save(user);
                System.out.println("\n💚 Default felhasználó létrehozva:");
                System.out.println("   username: tesztuser");
                System.out.println("   password: teszt123\n");
            }
        };
    }
}