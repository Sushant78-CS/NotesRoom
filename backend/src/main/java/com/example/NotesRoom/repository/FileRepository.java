package com.example.NotesRoom.repository;

import com.example.NotesRoom.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByUploadedById(Long uploadedById);

    List<FileEntity> findByGroup_Id(Long groupId);

    FileEntity findByIdAndGroup_Id(Long fileId, Long groupId);
}
