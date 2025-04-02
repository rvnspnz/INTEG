package auction.repositories;

import auction.entities.User;
import auction.entities.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    List<User> findAllByRole(Role role);

    Optional<User> findByUsername(String username);
}
