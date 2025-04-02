package auction.services;

import auction.entities.Bid;
import auction.entities.Payment;
import auction.entities.User;
import auction.entities.DTO.PaymentDTO;
import auction.entities.enums.PaymentStatus;
import auction.entities.enums.Role;
import auction.exceptions.ServiceException;
import auction.repositories.BidRepository;
import auction.repositories.PaymentRepository;
import auction.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;

    public List<PaymentDTO> getPaymentsByCustomer(Long customerId) {
        return paymentRepository.findByCustomerId(customerId)
                .stream()
                .map(PaymentDTO::new)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsBySeller(Long sellerId) {
        return paymentRepository.findBySellerId(sellerId)
                .stream()
                .map(PaymentDTO::new)
                .collect(Collectors.toList());
    }


    public PaymentDTO getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .map(PaymentDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found"));
    }

    @Transactional
    public PaymentDTO createPayment(Long bidId, HttpSession session) {
        try {
            User loggedInUser = (User) session.getAttribute("loggedInUser");
            if (loggedInUser == null) {
                throw new ServiceException("Unauthorized. Please log in.", new RuntimeException());
            }

            Bid bid = bidRepository.findById(bidId)
                    .orElseThrow(() -> new EntityNotFoundException("Bid not found"));

            User customer = bid.getCustomer();
            User seller = bid.getItem().getSeller();
            BigDecimal amount = bid.getBidAmount();

            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Invalid bid amount for payment.");
            }

            if (!loggedInUser.getId().equals(customer.getId())) {
                throw new ServiceException("Only the customer can make this payment.", new RuntimeException());
            }

            Payment payment = Payment.builder()
                    .bid(bid)
                    .customer(customer)
                    .seller(seller)
                    .amount(amount)
                    .paymentStatus(PaymentStatus.COMPLETED)
                    .transactionTime(LocalDateTime.now())
                    .build();

            return new PaymentDTO(paymentRepository.save(payment));
        } catch (Exception e) {
            throw new ServiceException("Error creating payment", e);
        }
    }
}
