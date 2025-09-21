package in.pandac.store.controller;

import in.pandac.store.dto.PaymentIntentRequestDto;
import in.pandac.store.dto.PaymentIntentResponseDto;
import in.pandac.store.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentIntentResponseDto> createPaymentIntent(
            @RequestBody PaymentIntentRequestDto paymentRequest) {
        PaymentIntentResponseDto response =
                paymentService.createPaymentIntent(paymentRequest);
        return ResponseEntity.ok(response);
    }

}
