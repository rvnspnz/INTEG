package auction.entities.RO;
import auction.entities.SellerApplication;
import auction.entities.enums.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerApplicationRO {
    private Long applicationId;
    private UserRO user;
    private String description;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime approvedAt;
    private UserRO admin;

    public SellerApplication toEntity() {
        return SellerApplication.builder()
                .applicationId(this.applicationId)
                .user(this.user != null ? this.user.toEntity() : null)
                .description(this.description)
                .status(this.status)
                .appliedAt(this.appliedAt)
                .approvedAt(this.approvedAt)
                .admin(this.admin != null ? this.admin.toEntity() : null)
                .build();
    }
}