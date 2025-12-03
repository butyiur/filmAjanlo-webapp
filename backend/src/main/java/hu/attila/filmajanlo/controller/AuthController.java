package hu.attila.filmajanlo.controller;

import hu.attila.filmajanlo.model.LoginRequest;
import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.repository.UserRepository;
import hu.attila.filmajanlo.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        var user = userRepository.findByUsername(req.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return ResponseEntity.ok(token);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow();

        record MeDto(Long id, String username, String role) {}
        return ResponseEntity.ok(new MeDto(user.getId(), user.getUsername(), user.getRole()));
    }
}