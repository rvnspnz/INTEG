package auction.entities.DTO;


import auction.entities.Item;
import auction.entities.enums.AuctionStatus;
import auction.entities.enums.ItemStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO implements Serializable {


    @Serial
    private static final long serialVersionUID = 1L;


    private Long id;
    private String name;
    private String description;
   
    @JsonProperty("startingPrice")
    private BigDecimal startingPrice;
   
    @JsonProperty("starting_price")
    public BigDecimal getStartingPriceSnakeCase() {
        return startingPrice;
    }
   
    private BigDecimal bidIncrement;
    private ItemStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private AuctionStatus auctionStatus;
    private String imageBase64;
   
    // Seller information
    private Long sellerId;
    private String sellerUsername;
    private String sellerName; // First name + last name or just username if no name is available
   
    // Category information
    private Long categoryId;
    private String categoryName;


    public ItemDTO(Item item) {
        this.id = item.getId();
        this.name = item.getName();
        this.description = item.getDescription();
        this.startingPrice = item.getStartingPrice();
        this.bidIncrement = item.getBidIncrement();
        this.status = item.getStatus();
        this.startTime = item.getStartTime();
        this.endTime = item.getEndTime();
        this.auctionStatus = item.getAuctionStatus();
        this.imageBase64 = item.getImageBase64();
       
        // Set seller information if available
        if (item.getSeller() != null) {
            this.sellerId = item.getSeller().getId();
            this.sellerUsername = item.getSeller().getUsername();
           
            // Set seller name - in case we need to show "Unknown Artist" on frontend
            // the frontend can check if sellerName is null or empty
            if (item.getSeller().getFirstName() != null && item.getSeller().getLastName() != null) {
                this.sellerName = item.getSeller().getFirstName() + " " + item.getSeller().getLastName();
            } else {
                this.sellerName = item.getSeller().getUsername();
            }
        }
       
        // Set category information if available
        if (item.getCategory() != null) {
            this.categoryId = item.getCategory().getId();
            this.categoryName = item.getCategory().getName();
        }
    }
}


