package com.example.NotesRoom.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JoinGroupResponseDto {
    private String groupName;
    private String userName;
    private Long id;
}
