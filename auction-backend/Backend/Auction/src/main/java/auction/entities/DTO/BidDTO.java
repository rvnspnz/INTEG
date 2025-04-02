package auction.entities.DTO;

import auction.entities.Bid;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BidDTO {
    private Long id;
    private BigDecimal bidAmount;
    private UserDTO customer;
    private UserDTO seller;

    public BidDTO(Bid bid) {
        this.id = bid.getId();
        this.bidAmount = bid.getBidAmount();
        this.customer = new UserDTO(bid.getCustomer());
        this.seller = new UserDTO(bid.getSeller());
    }
}
