package com.Eshiksha.controllers;

import com.Eshiksha.Entities.LiveClass;
import com.Eshiksha.dto.LiveClassDTO;
import com.Eshiksha.services.LiveClassService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/live")
public class LiveClassController {

    private final LiveClassService liveClassService;

    public LiveClassController(LiveClassService liveClassService) {
        this.liveClassService = liveClassService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<Map<String, Object>> getAllLiveClassByCourse(@PathVariable int courseId){
        Map<String, Object> res = new HashMap<>();
        try {
            List<LiveClass> liveClasses = liveClassService.getAllLiveClassesByCourse(courseId);
            res.put("data", liveClasses);
            return ResponseEntity.ok(res);
        }catch (Exception e){
            res.put("message", "unable to fetch live course from this course");
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<Map<String, Object>> getLiveClassesByTeacher(@PathVariable int teacherId) {
        Map<String, Object> res = new HashMap<>();
        try {
            List<LiveClass> liveClasses = liveClassService.getAllLiveClassesByTeacher(teacherId);
            res.put("data", liveClasses);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("message", "Unable to fetch live classes for this teacher");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getLiveClassesByStudent(@PathVariable int studentId) {
        Map<String, Object> res = new HashMap<>();
        try {
            List<LiveClass> liveClasses = liveClassService.getAllLiveClassesByStudent(studentId);
            res.put("data", liveClasses);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("message", "Unable to fetch live classes : "+ e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @PostMapping("/")
    public ResponseEntity<Map<String, Object>> createLiveClass(@RequestBody LiveClassDTO liveClassDTO) {
        Map<String, Object> res = new HashMap<>();
        try {
            liveClassService.createLiveClass(liveClassDTO);  // Call the service method to handle the mapping
            res.put("message", "Live class created successfully");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("message", "Failed to create live class");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @PutMapping("/{liveClassId}")
    public ResponseEntity<Map<String, Object>> updateLiveClass(@PathVariable int liveClassId, @RequestBody LiveClassDTO liveClassDTO ){
        Map<String , Object> res = new HashMap<>();
        try{
            liveClassService.updateLiveClass(liveClassId, liveClassDTO);
            res.put("message", "Live class updated successfully");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("message", "Failed to update live class");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @DeleteMapping("/{liveClassId}")
    public ResponseEntity<Map<String, String>> deleteLiveClass(@PathVariable int liveClassId) {
        Map<String, String> response = new HashMap<>();
        try {
            if (liveClassService.deleteLiveClass(liveClassId)) {
                response.put("message", "Live class deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Live class not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("message", "Failed to delete live class");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
 }
