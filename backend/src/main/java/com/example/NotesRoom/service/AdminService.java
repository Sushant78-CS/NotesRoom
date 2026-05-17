package com.example.NotesRoom.service;

import com.example.NotesRoom.config.CloudinaryConfig;
import com.example.NotesRoom.dto.type.RoleType;
import com.example.NotesRoom.entity.Users;
import com.example.NotesRoom.repository.FileRepository;
import com.example.NotesRoom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }
}
