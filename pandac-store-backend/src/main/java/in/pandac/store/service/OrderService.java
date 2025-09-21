package in.pandac.store.service;

import in.pandac.store.dto.OrderRequestDto;
import in.pandac.store.dto.OrderResponseDto;

import java.util.List;

public interface OrderService {

    void createOrder(OrderRequestDto orderRequest);

    List<OrderResponseDto> getCustomerOrders();

    List<OrderResponseDto> getAllPendingOrders();

    void updateOrderStatus(Long orderId, String orderStatus);
}
