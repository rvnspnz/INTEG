package auction.entities.DTO;

import auction.entities.Payment;
import auction.entities.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private BidDTO bid;
    private BigDecimal amount;
    private PaymentStatus paymentStatus;
    private LocalDateTime transactionTime;

    public PaymentDTO(Payment payment) {
        this.id = payment.getId();
        this.bid = new BidDTO(payment.getBid()); // Ensure BidDTO only contains minimal data
        this.amount = payment.getAmount();
        this.paymentStatus = payment.getPaymentStatus();
        this.transactionTime = payment.getTransactionTime();
    }
}
