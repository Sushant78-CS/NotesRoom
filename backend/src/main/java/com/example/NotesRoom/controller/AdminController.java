package com.example.NotesRoom.controller;

import com.example.NotesRoom.dto.*;
import com.example.NotesRoom.entity.FileEntity;
import com.example.NotesRoom.entity.Users;
import com.example.NotesRoom.repository.FileRepository;
import com.example.NotesRoom.repository.UserRepository;
import com.example.NotesRoom.service.AdminService;
import com.example.NotesRoom.service.FileService;
import com.example.NotesRoom.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final GroupService groupService;
    private final FileRepository fileRepository;

    @PostMapping(
            value = "/file/group/{groupId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<FileResponseDto> uploadFile(@RequestParam("file") MultipartFile file, @PathVariable Long groupId, @AuthenticationPrincipal Users users) {
        System.out.println("UPLOAD API HIT");
        FileResponseDto uploadedFile = fileService.uploadFile(file, users.getId(), groupId);
        FileResponseDto fileResponseDto = new FileResponseDto(
                uploadedFile.getId(), uploadedFile.getFileUrl(), uploadedFile.getFileName(), uploadedFile.getUploadedByUsername()
        );

        return ResponseEntity.ok(uploadedFile);
    }

    @DeleteMapping("/group/{groupId}/files/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId, @PathVariable Long groupId, @AuthenticationPrincipal Users user) {
        boolean deletedFile = fileService.deleteFile(fileId, groupId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/files")
    public ResponseEntity<List<FileResponseDto>> getAllFiles(@AuthenticationPrincipal Users users) {
        List<FileResponseDto> allFiles = fileService.getAllFiles(users);

        return ResponseEntity.ok(allFiles);
    }

    @PutMapping("/file/{fileId}")
    public ResponseEntity<FileResponseDto> updateFile(@RequestParam("file") MultipartFile file, @PathVariable Long fileId, @AuthenticationPrincipal Users users) {
        FileResponseDto fileResponseDto = fileService.updateFile(fileId, file, users.getId());

        return ResponseEntity.ok(fileResponseDto);
    }

    @GetMapping("/group/users/{groupId}")
    public ResponseEntity<List<UserDto>> getAllGroupUsers(@PathVariable Long groupId, @AuthenticationPrincipal Users user) {
        List<UserDto> allGroupUsers = groupService.getAllGroupUsers(user, groupId);

        return ResponseEntity.ok(allGroupUsers);
    }

    @DeleteMapping("/group/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long groupId, @AuthenticationPrincipal Users user) {
        groupService.deleteGroup(user, groupId);
        return ResponseEntity.ok("Group deleted successfully");
    }

    @DeleteMapping("/group/{targetUserId}/{groupId}")
    public ResponseEntity<String> deleteGroupUser(@PathVariable Long targetUserId, @AuthenticationPrincipal Users user, @PathVariable Long groupId) {
        groupService.deleteGroupUser(user, targetUserId, groupId);

        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/group")
    public ResponseEntity<?> getCreatedGroups(@AuthenticationPrincipal Users user) {
        List<AllGroupResponseDto> allCreatedGroup = groupService.getAllCreatedGroup(user.getId());

        return ResponseEntity.ok(allCreatedGroup);
    }

}











