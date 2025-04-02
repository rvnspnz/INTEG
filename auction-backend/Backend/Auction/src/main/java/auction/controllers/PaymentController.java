package auction.controllers;

import auction.entities.Payment;
import auction.entities.DTO.PaymentDTO;
import auction.entities.enums.PaymentStatus;
import auction.entities.utils.ResponseUtils;
import auction.exceptions.ServiceException;
import auction.services.PaymentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentById(paymentId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByCustomer(customerId));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(paymentService.getPaymentsBySeller(sellerId));
    }

    @PostMapping("/create/{bidId}")
    public ResponseEntity<?> createPayment(@PathVariable Long bidId, HttpSession session) {
        try {
            PaymentDTO payment = paymentService.createPayment(bidId, session);
            return ResponseEntity.ok(payment);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseUtils.buildErrorResponse(
                    HttpStatus.FORBIDDEN, e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseUtils.buildErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create payment"
            ));
        }
    }
}
