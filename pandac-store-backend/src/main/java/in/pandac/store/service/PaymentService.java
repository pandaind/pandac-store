package in.pandac.store.service;


import in.pandac.store.dto.PaymentIntentRequestDto;
import in.pandac.store.dto.PaymentIntentResponseDto;

public interface PaymentService {

    PaymentIntentResponseDto createPaymentIntent(PaymentIntentRequestDto requestDto);
}
