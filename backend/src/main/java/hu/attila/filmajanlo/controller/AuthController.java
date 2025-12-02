package hu.attila.filmajanlo.controller;

import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.model.LoginRequest;
import hu.attila.filmajanlo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // -------------------
    // REGISTRATION (később finomítjuk)
    // -------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
        user.setRole("USER");

        userRepository.save(user);
        return ResponseEntity.ok("Registration successful!");
    }

    // -------------------
    // LOGIN – csak ellenőriz, token tőled jön (Basic)
    // -------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        User user = userRepository.findByUsername(req.getUsername()).orElse(null);

        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid username or password!");
        }

        // Nincs JWT, csak visszaszólunk, hogy oké
        return ResponseEntity.ok().build();
    }

    // -------------------
    // KI VAGYOK ÉN?  (frontendnek kell a role)
    // -------------------
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow();

        // Password NÉLKÜL küldjük vissza
        record MeDto(Long id, String username, String role) {}
        return ResponseEntity.ok(new MeDto(user.getId(), user.getUsername(), user.getRole()));
    }
}