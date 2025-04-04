package auction.controllers;


import auction.entities.Bid;
import auction.entities.DTO.BidDTO;
import auction.entities.RO.BidRO;
import auction.services.BidService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.stream.Collectors;


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
