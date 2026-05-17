package com.example.NotesRoom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupResponseDto {
    private String groupName;
    private Long createdById;
    private String createdByUsername;
    private String inviteCode;
}
