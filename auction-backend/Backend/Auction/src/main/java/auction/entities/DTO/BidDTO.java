package auction.entities.DTO;

<<<<<<< Updated upstream
import auction.entities.Bid;
import lombok.*;

import java.math.BigDecimal;

=======
import java.math.BigDecimal;
import java.time.LocalDateTime;

import auction.entities.Bid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for Bid entity
 */
>>>>>>> Stashed changes
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BidDTO {
<<<<<<< Updated upstream
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
=======
   private Long id;
   private BigDecimal bidAmount;
   private ItemDTO item; 
   private UserDTO customer;
   private String sellerName;
   private LocalDateTime bidTime;
   private String transactionId;
   private BigDecimal finalPrice;

   /**
    * Constructor for BidDTO
    * @param bid Bid entity
    */
   public BidDTO(Bid bid) {
       this.id = bid.getId();
       this.bidAmount = bid.getBidAmount();
       this.item = new ItemDTO(bid.getItem()); 
       this.customer = new UserDTO(bid.getCustomer());
       this.sellerName = bid.getSeller().getUsername();
       this.bidTime = bid.getBidTime();
       this.transactionId = "TRX-" + String.format("%03d", bid.getId());
       this.finalPrice = bid.getFinalPrice();
   }
>>>>>>> Stashed changes
}
