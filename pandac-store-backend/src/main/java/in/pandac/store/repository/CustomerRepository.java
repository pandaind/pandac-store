package in.pandac.store.repository;

import in.pandac.store.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

  Optional<Customer> findByEmail(String email);
  Optional<Customer> findByEmailOrMobileNumber(String email, String mobileNumber);
  
  @Query("SELECT DISTINCT c FROM Customer c LEFT JOIN FETCH c.roles LEFT JOIN FETCH c.address WHERE c.customerId = :id")
  Optional<Customer> findByIdWithRolesAndAddress(@Param("id") Long id);
  
  @Query("SELECT DISTINCT c FROM Customer c LEFT JOIN FETCH c.roles LEFT JOIN FETCH c.address")
  List<Customer> findAllWithRolesAndAddress();
  
  @Query("SELECT DISTINCT c FROM Customer c LEFT JOIN FETCH c.roles LEFT JOIN FETCH c.address WHERE c.email = :email")
  Optional<Customer> findByEmailWithRolesAndAddress(@Param("email") String email);
}