package com.examly.springapp.service;

import com.examly.springapp.model.User;
import java.util.List;

public interface UserService {
    User saveUser(User user);
    List<User> getAllUsers();
    User getUserById(Long id);
    User getUserByUsername(String username);
    User findByUsername(String username);
    void deleteUser(Long id);
}
