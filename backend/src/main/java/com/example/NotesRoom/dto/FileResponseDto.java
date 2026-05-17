package com.example.NotesRoom.dto;

import com.example.NotesRoom.entity.FileEntity;
import com.example.NotesRoom.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileResponseDto {
    private Long id;
    private String fileUrl;
    private String fileName;
    private String uploadedByUsername;
}
