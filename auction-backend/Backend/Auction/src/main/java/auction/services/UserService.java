package auction.services;

import auction.entities.RO.UserRO;
import auction.entities.User;
import auction.entities.enums.Role;
import auction.entities.utils.MessageUtils;
import auction.entities.utils.ResponseUtils;
import auction.exceptions.ServiceException;
import auction.repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAll() {
        try {
            List<User> users = userRepository.findAll();
            log.info(MessageUtils.retrieveSuccess("Users"));
            return users;
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.retrieveError("Users"), e);
        }
    }

    public List<User> getAllByFilter(Role role) {
        try {
            return userRepository.findAllByRole(role);
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.retrieveError("Filtered Users"), e);
        }
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() ->
                new ServiceException(MessageUtils.notFound("User"), new RuntimeException("User not found")));
    }

    @Transactional
    public void save(UserRO userRO) {
        try {
            User user = userRO.toEntity();
            userRepository.save(user);
            log.info(MessageUtils.saveSuccess("User"));
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.saveError("User"), e);
        }
    }

    @Transactional
    public void update(Long id, UserRO userRO) {
        try {
            User existingUser = getUserById(id);
            existingUser.updateFromRO(userRO);
            userRepository.save(existingUser);
            log.info(MessageUtils.updateSuccess("User"));
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.updateError("User"), e);
        }
    }

    @Transactional
    public void delete(Long id) {
        try {
            User user = getUserById(id);
            userRepository.delete(user);
            log.info(MessageUtils.deleteSuccess("User"));
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.deleteError("User"), e);
        }
    }

    @Transactional
    public ResponseEntity<?> login(String username, String password, HttpSession session) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ServiceException(MessageUtils.userNotFound("User"),
                            new RuntimeException("User not found")));

            if (password.equals(user.getPassword())) {
                session.setAttribute("loggedInUser", user);
                return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                        HttpStatus.OK, MessageUtils.loginSuccess("User")));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseUtils.buildErrorResponse(
                        HttpStatus.UNAUTHORIZED, MessageUtils.loginFailed("User")));
            }
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseUtils.buildErrorResponse(
                    HttpStatus.NOT_FOUND, MessageUtils.userNotFound("User")));
        } catch (Exception e) {
            log.error(MessageUtils.loginFailed("User"), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseUtils.buildErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR, MessageUtils.loginFailed("User")));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(HttpStatus.OK, "Logged out successfully"));
    }
}
