package auction.entities;

import auction.entities.RO.BidRO;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name = "bid_amount", nullable = false)
    private BigDecimal bidAmount;

    @Column(name = "bid_time", nullable = false, updatable = false)
    private LocalDateTime bidTime;

    @PrePersist
    protected void onCreate() {
        if (bidTime == null) {
            bidTime = LocalDateTime.now();
        }
    }

    public void updateFromRO(BidRO bidRO, Item item, User customer) {
        this.item = item;
        this.customer = customer;
        this.user = customer;
        this.seller = seller;
        this.bidAmount = bidRO.getBidAmount();
        this.bidTime = LocalDateTime.now();
    }
}
