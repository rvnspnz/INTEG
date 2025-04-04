package auction.repositories;


import auction.entities.Payment;
import auction.entities.enums.PaymentStatus;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface PaymentRepository extends JpaRepository<Payment, Long> {
   List<Payment> findByCustomerId(Long customerId);
   List<Payment> findBySellerId(Long sellerId);




    // Find payments by customerId and PaymentStatus
   List<Payment> findByCustomerIdAndPaymentStatus(Long customerId, PaymentStatus status);


   // Find payments by sellerId and PaymentStatus
   List<Payment> findBySellerIdAndPaymentStatus(Long sellerId, PaymentStatus status);


}
