package auction.controllers;




import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import auction.entities.Bid;
import auction.entities.DTO.BidDTO;
import auction.entities.RO.BidRO;
import auction.services.BidService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;




@RestController
@RequestMapping("/api/bid")
@RequiredArgsConstructor
public class BidController {




   private final BidService bidService;




   @GetMapping
   public ResponseEntity<List<BidDTO>> getAllBids() {
       List<BidDTO> bids = bidService.getAllBids()
                                     .stream()
                                     .map(BidDTO::new)
                                     .collect(Collectors.toList());
       return ResponseEntity.ok(bids);
   }




   @GetMapping("/item/{itemId}")
   public ResponseEntity<List<BidDTO>> getBidsByItem(@PathVariable Long itemId) {
       List<BidDTO> bids = bidService.getBidsByItem(itemId)
                                     .stream()
                                     .map(BidDTO::new)
                                     .collect(Collectors.toList());
       return ResponseEntity.ok(bids);
   }




   @GetMapping("/user/{userId}")
   public ResponseEntity<List<BidDTO>> getBidsByUser(@PathVariable Long userId) {
       List<BidDTO> bids = bidService.getBidsByUser(userId)
                                     .stream()
                                     .map(BidDTO::new)
                                     .collect(Collectors.toList());
       return ResponseEntity.ok(bids);
   }




   @GetMapping("/filter")
   public ResponseEntity<List<BidDTO>> getAllByFilter(
           @RequestParam(required = false) Long itemId,
           @RequestParam(required = false) Long customerId) {




       List<BidDTO> bids = bidService.getAllByFilter(itemId, customerId)
               .stream()
               .map(BidDTO::new)
               .collect(Collectors.toList());




       return ResponseEntity.ok(bids);
   }
   
   /**
    * Check if a user is the winner of an auction
    */
   @GetMapping("/winner")
   public ResponseEntity<Map<String, Object>> checkWinner(
           @RequestParam Long itemId,
           @RequestParam Long userId) {
       
       boolean isWinner = bidService.isUserAuctionWinner(itemId, userId);
       Optional<Bid> winningBid = bidService.getAuctionWinner(itemId);
       
       Map<String, Object> response = Map.of(
           "isWinner", isWinner,
           "winningAmount", winningBid.isPresent() ? winningBid.get().getBidAmount() : null
       );
       
       return ResponseEntity.ok(response);
   }




   @PostMapping
   public ResponseEntity<BidDTO> placeBid(@RequestBody BidRO bidRO, HttpSession session) {
       Bid bid = bidService.placeBid(bidRO, session);
       return ResponseEntity.ok(new BidDTO(bid));
   }




   @DeleteMapping("/{bidId}")
   public ResponseEntity<Void> deleteBid(@PathVariable Long bidId) {
       bidService.deleteBid(bidId);
       return ResponseEntity.noContent().build();
   }
}


