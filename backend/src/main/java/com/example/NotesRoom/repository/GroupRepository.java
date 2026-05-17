package com.example.NotesRoom.repository;

import com.example.NotesRoom.entity.Group;
import com.example.NotesRoom.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByInviteCode(String inviteCode);

    List<Group> findByCreatedBy(Users user);
}
