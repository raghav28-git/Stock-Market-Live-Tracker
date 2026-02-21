package com.examly.springapp.repository;

import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true")
    List<User> findActiveUsers();
    
    @Query("SELECT u FROM User u WHERE :role MEMBER OF u.roles")
    List<User> findByRole(@Param("role") User.Role role);
    
    @Query("SELECT u FROM User u WHERE u.accountType = :accountType")
    List<User> findByAccountType(@Param("accountType") User.AccountType accountType);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}
