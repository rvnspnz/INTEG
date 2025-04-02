package auction.repositories;

import auction.entities.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByItemId(Long itemId);

    List<Bid> findByCustomerId(Long customerId);

    // ✅ Custom Query for Filtering by Item and Customer
    @Query("SELECT b FROM Bid b WHERE " +
            "(:itemId IS NULL OR b.item.id = :itemId) AND " +
            "(:customerId IS NULL OR b.customer.id = :customerId)")
    List<Bid> findByFilter(
            @Param("itemId") Long itemId,
            @Param("customerId") Long customerId
    );
}
