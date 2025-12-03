package hu.attila.filmajanlo.controller;

import hu.attila.filmajanlo.dto.UserDto;
import hu.attila.filmajanlo.model.User;
import hu.attila.filmajanlo.repository.UserMovieRepository;
import hu.attila.filmajanlo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final UserMovieRepository userMovieRepository;

    // 🔹 Összes user listázása
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> listUsers() {

        var users = userRepository.findAll()
                .stream()
                .map(u -> new UserDto(
                        u.getId(),
                        u.getUsername(),
                        u.getRole(),
                        u.getCreatedAt(),
                        u.getLastLogin()
                ))
                .toList();

        return ResponseEntity.ok(users);
    }

    // 🔹 User törlése saját filmekkel együtt
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User target = userOpt.get();

        // 🔒 ne tudja magát törölni
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth != null ? auth.getName() : null;

        if (currentUsername != null && currentUsername.equals(target.getUsername())) {
            return ResponseEntity.badRequest().body("Saját fiókot nem törölhetsz.");
        }

        // töröljük a user saját listáját
        userMovieRepository.deleteByOwnerId(id);

        // töröljük magát a usert
        userRepository.deleteById(id);

        return ResponseEntity.ok("User deleted successfully");
    }
}