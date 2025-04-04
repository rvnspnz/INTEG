package auction.entities;

import auction.entities.RO.UserRO;
import auction.entities.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", columnDefinition = "BIGINT")
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "bio", nullable = true)
    private String bio;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public void updateFromRO(UserRO userRO) {
        if (userRO.getFirstName() != null) {
            this.firstName = userRO.getFirstName();
        }
        if (userRO.getLastName() != null) {
            this.lastName = userRO.getLastName();
        }
        if (userRO.getUsername() != null) {
            this.username = userRO.getUsername();
        }
        if (userRO.getEmail() != null) {
            this.email = userRO.getEmail();
        }
        if (userRO.getPassword() != null) {
            this.password = userRO.getPassword();
        }
        if (userRO.getBio() != null) {
            this.bio = userRO.getBio();
        }
        if (userRO.getRole() != null) {
            this.role = userRO.getRole();
        }
    }    
}
