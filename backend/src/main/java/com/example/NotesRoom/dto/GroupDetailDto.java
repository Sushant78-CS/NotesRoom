package com.example.NotesRoom.dto;

import com.example.NotesRoom.entity.FileEntity;
import com.example.NotesRoom.entity.Group;
import com.example.NotesRoom.entity.GroupMember;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupDetailDto {
    Long id;
    String name;
    String inviteCode;
    Long createdById;
    String createdByUsername;
    Integer memberCount;
}
