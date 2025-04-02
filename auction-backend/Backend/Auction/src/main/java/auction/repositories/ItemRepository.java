package auction.repositories;

import auction.entities.Category;
import auction.entities.Item;
import auction.entities.enums.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findAllByStatus(ItemStatus status);

    @Query("SELECT i FROM Item i " +
            "LEFT JOIN FETCH i.category " +
            "WHERE (:status IS NULL OR i.status = :status) " +
            "AND (:categoryId IS NULL OR i.category.id = :categoryId)")
    List<Item> findAllByOptionalFilters(@Param("status") ItemStatus status,
                                        @Param("categoryId") Long categoryId);

}
