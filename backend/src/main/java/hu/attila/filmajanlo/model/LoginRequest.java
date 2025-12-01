package hu.attila.filmajanlo.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;  // ← sima jelszó, nem hash!
}