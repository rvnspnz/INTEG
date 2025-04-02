package auction.entities.RO;

import auction.entities.Category;
import auction.entities.Item;
import auction.entities.User;
import auction.entities.enums.AuctionStatus;
import auction.entities.enums.ItemStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.util.HashSet;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemRO {
    private String name;
    private String description;
    private BigDecimal startingPrice;
    private BigDecimal bidIncrement;
    private ItemStatus status;
    private Long categoryId;
    private Long sellerId;
    private String imageBase64;


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;

    private AuctionStatus auctionStatus;

    public Item toEntity(User seller, Category category) {
        Item item = Item.builder()
                .imageBase64(this.imageBase64)
                .name(this.name)
                .description(this.description)
                .startingPrice(this.startingPrice != null ? this.startingPrice : BigDecimal.ZERO)
                .bidIncrement(this.bidIncrement != null ? this.bidIncrement : BigDecimal.ZERO)
                .seller(seller)
                .category(category)
                .startTime(this.startTime)
                .endTime(this.endTime)
                .status(this.status != null ? this.status : ItemStatus.PENDING)
                .auctionStatus(this.auctionStatus != null ? this.auctionStatus : AuctionStatus.NOT_STARTED)
                .build();

        return item;
    }
}
