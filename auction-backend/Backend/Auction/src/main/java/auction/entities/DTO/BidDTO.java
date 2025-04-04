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
   private ItemDTO item; 
   private UserDTO customer;
   private Long itemId;
   private Long customerId;


   public BidDTO(Bid bid) {
       this.id = bid.getId();
       this.bidAmount = bid.getBidAmount();
       this.item = new ItemDTO(bid.getItem()); 
       this.customer = new UserDTO(bid.getCustomer());
       this.itemId = bid.getItem().getId();
       this.customerId = bid.getCustomer().getId();
   }
}
