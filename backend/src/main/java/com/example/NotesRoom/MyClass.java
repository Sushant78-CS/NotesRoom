package com.example.NotesRoom;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyClass {

    @GetMapping("/abc")
    public String greet() {
        return "Hello Sushant";
    }

}
