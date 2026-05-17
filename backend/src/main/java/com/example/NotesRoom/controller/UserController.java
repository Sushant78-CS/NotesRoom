package com.example.NotesRoom.controller;

import com.example.NotesRoom.dto.*;
import com.example.NotesRoom.entity.Users;
import com.example.NotesRoom.service.FileService;
import com.example.NotesRoom.service.GroupService;
import com.example.NotesRoom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final GroupService groupService;
    private final FileService fileService;

    @PutMapping("/become-admin")
    public ResponseEntity<UserResponseDto> upgradeToAdmin(@RequestBody AdminUpgradeRequestDto code) {
        Users users1 = userService.becomeAdmin(code.getCode());
        UserResponseDto response = new UserResponseDto(users1.getId(), users1.getUsername(), users1.getRole());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/join-group")
    public ResponseEntity<JoinGroupResponseDto> joinGroup(@AuthenticationPrincipal Users user, @RequestBody JoinGroupRequestDto inviteCode) {
        JoinGroupResponseDto joinGroupResponseDto = groupService.joinGroup(user, inviteCode.getInviteCode());

        return ResponseEntity.ok(joinGroupResponseDto);
    }

    @DeleteMapping("/group/{groupId}")
    public ResponseEntity<String> leaveGroup(@PathVariable Long groupId, @AuthenticationPrincipal Users user) {
        groupService.leaveGroup(user, groupId);

        return ResponseEntity.ok(user.getUsername() + " has leave the group");
    }

    @PostMapping("/create-group")
    public ResponseEntity<GroupResponseDto> createGroup(@RequestBody CreateGroupRequestDto groupName, @AuthenticationPrincipal Users user) {
        GroupResponseDto group = groupService.createGroup(user, groupName.getGroupName());

        return ResponseEntity.ok(group);
    }

    @GetMapping("/all-group")
    public ResponseEntity<List<AllGroupResponseDto>> getAllGroup(@AuthenticationPrincipal Users user) {
        List<AllGroupResponseDto> allGroup = groupService.getAllGroup(user);

        return ResponseEntity.ok(allGroup);
    }

    @GetMapping("/joined-group")
    public ResponseEntity<List<AllGroupResponseDto>> getAllJoinedGroup(@AuthenticationPrincipal Users user) {
        List<AllGroupResponseDto> allJoinedGroup = groupService.getAllJoinedGroup(user.getId());

        return ResponseEntity.ok(allJoinedGroup);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<GroupDetailDto> getGroupDetail(@PathVariable Long groupId, @AuthenticationPrincipal Users user) {
        GroupDetailDto groupDetail = groupService.getGroupDetail(groupId, user.getId());

        return ResponseEntity.ok(groupDetail);
    }

    @GetMapping("group/{groupId}/members")
    public ResponseEntity<List<MemberResponseDto>> getMembers(@PathVariable Long groupId, @AuthenticationPrincipal Users user) throws AccessDeniedException {
        List<MemberResponseDto> members = groupService.getMembers(user.getId(), groupId);

        return ResponseEntity.ok(members);
    }

    @GetMapping("group/{groupId}/files")
    public ResponseEntity<GroupFilesResponseDto> getFiles(@PathVariable Long groupId, @AuthenticationPrincipal Users user) throws AccessDeniedException {
        GroupFilesResponseDto files = groupService.getFiles(user.getId(), groupId);

        return ResponseEntity.ok(files);
    }
}
