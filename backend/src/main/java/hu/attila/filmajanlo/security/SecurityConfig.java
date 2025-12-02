package hu.attila.filmajanlo.security;

import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getUsername())
                    .password(user.getPasswordHash())
                    .roles(user.getRole())   // "USER" vagy "ADMIN"
                    .build();
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable());
        http.cors(Customizer.withDefaults());
        http.headers(h -> h.frameOptions(f -> f.disable()));

        http.authorizeHttpRequests(auth -> auth

                // preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // auth + H2
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()

                // Filmek
                .requestMatchers(HttpMethod.GET, "/api/movies/**").permitAll()       // mindenki láthatja
                .requestMatchers(HttpMethod.POST, "/api/movies/**").hasRole("ADMIN") // csak admin adhat hozzá
                .requestMatchers(HttpMethod.PUT, "/api/movies/**").hasRole("ADMIN")  // csak admin módosíthat
                .requestMatchers(HttpMethod.DELETE, "/api/movies/**").hasRole("ADMIN") // csak admin törölhet
                .requestMatchers(HttpMethod.POST, "/api/categories").hasRole("ADMIN") //csak admin adhat hozzá kategóriát


                // Kategóriák: GET bárki, módosítás ADMIN
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers("/api/categories/**").hasRole("ADMIN")

                // Saját lista: csak belépve
                .requestMatchers("/api/user/movies/**").authenticated()

                // minden más
                .anyRequest().permitAll()
        );

        http.httpBasic(Customizer.withDefaults());

        http.exceptionHandling(e ->
                e.authenticationEntryPoint((req, res, ex) -> {
                    res.setStatus(401);
                    res.getWriter().write("Unauthorized");
                })
        );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:5173"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setExposedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}