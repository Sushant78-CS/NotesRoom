package com.example.NotesRoom.repository;

import com.example.NotesRoom.dto.AllGroupResponseDto;
import com.example.NotesRoom.dto.type.RoleType;
import com.example.NotesRoom.entity.Group;
import com.example.NotesRoom.entity.GroupMember;
import com.example.NotesRoom.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    boolean existsByUserAndGroup(Users user, Group group);

    boolean existsByUser_IdAndGroup_Id(Long userId, Long groupId);

    List<GroupMember> findByGroup_Id(Long groupId);

    Optional<GroupMember> findByUser_IdAndGroup_Id(Long userId, Long groupId);

    List<GroupMember> findByUser(Users user);

    List<GroupMember> findByUser_Id(Long userId);

    List<GroupMember> findByUser_IdAndRole(Long userId, RoleType role);

    Integer countByGroup_Id(Long groupId);

    @Query("SELECT new com.example.NotesRoom.dto.AllGroupResponseDto(m.group.id, m.group.name) " +
            "FROM GroupMember m WHERE m.user.id = :userId AND m.role = :role")
    List<AllGroupResponseDto> findGroupDtosByUserIdAndRole(@Param("userId") Long userId, @Param("role") RoleType role);
}
