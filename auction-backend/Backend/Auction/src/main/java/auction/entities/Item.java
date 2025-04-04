package auction.entities;

import auction.entities.RO.ItemRO;
import auction.entities.enums.AuctionStatus;
import auction.entities.enums.ItemStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "items")
public class Item {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id", columnDefinition = "BIGINT")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "starting_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal startingPrice;

    @Column(name = "bid_increment", nullable = false, precision = 10, scale = 2)
    private BigDecimal bidIncrement = BigDecimal.valueOf(1.00);

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ItemStatus status = ItemStatus.PENDING;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "auction_status", nullable = false)
    private AuctionStatus auctionStatus = AuctionStatus.NOT_STARTED;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "image_base64", columnDefinition = "LONGTEXT")
    private String imageBase64;

    public void updateFromRO(ItemRO itemRO) {
        this.name = itemRO.getName();
        this.description = itemRO.getDescription();
        this.startingPrice = itemRO.getStartingPrice();
        this.bidIncrement = itemRO.getBidIncrement();
        this.status = itemRO.getStatus();
        this.startTime = itemRO.getStartTime();
        this.endTime = itemRO.getEndTime();
        this.auctionStatus = itemRO.getAuctionStatus();
        this.imageBase64 = itemRO.getImageBase64();
        this.createdAt = itemRO.getCreatedAt();
    }
}
