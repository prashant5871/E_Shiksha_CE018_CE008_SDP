package com.Eshiksha.controllers;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.CourseCategory;
import com.Eshiksha.dto.CourseDTO;
import com.Eshiksha.services.CourseService;
import com.Eshiksha.services.VideoService;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/courses")
public class CourseController {
    @Value("${azure.storage.connection-string}")
    private String connectionString; // Fetch from application.properties

    @Value("${azure.storage.container.documents}")
    private String documentsContainer;

    @Value("${azure.storage.container.thumbnails}")
    private String thumbnailsContainer;
    private CourseService courseService;

    private VideoService videoService;

    public CourseController(CourseService courseService,VideoService videoService) {
        this.videoService = videoService;
        this.courseService = courseService;
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllCourses() {
        List<Course> courses = this.courseService.findAll();
        if (!courses.isEmpty()) {
            return ResponseEntity.ok(courses);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("there is not have any course!!");
    }

//    @GetMapping("/{courseId}")
//    public ResponseEntity<Course> getCourseById(@PathVariable int courseId)
//    {
//        try{
//            Course course = courseService.findById(courseId);
//
//            return ResponseEntity.status(HttpStatus.OK).body(course);
//        }catch (Exception e){
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        }
//    }

    @PostMapping("/test")
    public String testing() {
        return "testing succesfully...";
    }

    @GetMapping("/{id}")
    public Course getById(
            @PathVariable int id
    ) {
        return this.courseService.findById(id);
    }

    @GetMapping("/stream/{courseId}/master.m3u8")
    public ResponseEntity<Resource> getMasterPlaylist(@PathVariable int courseId) {
        try {
            System.out.println("Come for master.m3u8 file...");
            Course lession = courseService.findById(courseId);
            String basePath = lession.getDemoVideo();
            Path path = Paths.get(basePath, "master.m3u8");
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=master.m3u8")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM) // For .ts segments, if needed
                        .contentType(MediaType.valueOf("application/x-mpegURL")) // For .m3u8
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/stream/{courseId}/{resolution}/playlist.m3u8")
    public ResponseEntity<Resource> getResolutionPlaylist(
            @PathVariable int courseId,
            @PathVariable String resolution) {
        try {

            Course lession = courseService.findById(courseId);
            String base_path = lession.getDemoVideo();
            Path playlistPath = Paths.get(base_path, resolution, "playlist.m3u8");

            if (!Files.exists(playlistPath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new UrlResource(playlistPath.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/vnd.apple.mpegurl"))
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/stream/{courseId}/{resolution}/{segmentName:.+\\.ts}")
    public ResponseEntity<Resource> getVideoSegment(
            @PathVariable int courseId,
            @PathVariable String resolution,
            @PathVariable String segmentName) {
        try {
            Course lession = courseService.findById(courseId);
            String basePath = lession.getDemoVideo();
            Path segmentPath = Paths.get(basePath, resolution, segmentName);
            System.out.println(segmentPath.toString());
            if (!Files.exists(segmentPath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new UrlResource(segmentPath.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("video/MP2T"))
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /*
    @PostMapping("/")
    public ResponseEntity<String> createCourse(@RequestBody CourseDTO course, HttpServletRequest request) {
        System.out.println("inisde create method...\n");
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7);
            System.out.println("JWT Token: " + jwtToken);
            System.out.println("\n " + course);
            this.courseService.create(course.getCourseName(),course.getDescription(),course.getPrice(),course.getCategoryId(),jwtToken,"");

            return ResponseEntity.status(HttpStatus.CREATED).body("Course created succesfully");

        } else {
            System.out.println("Authorization header is missing or invalid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("can not created !");
        }
    }

     */

    @GetMapping("/get-categories")
    public ResponseEntity<?> getAllCategories()
    {
        try{
            List<CourseCategory> allCategories = this.courseService.findAllCategories();

            return ResponseEntity.ok(allCategories);

        }catch(Exception e)
        {
            Map<String,String> response = new HashMap<>();
            response.put("message", "Internal server error , please try again later");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/")
    public ResponseEntity<String> createCourse(@RequestParam String courseName,
                                               @RequestParam String description,
                                               @RequestParam float price,
                                               @RequestParam int categoryId,
                                               @RequestParam MultipartFile document,
                                               @RequestParam MultipartFile thumbnail,
                                               @RequestParam MultipartFile demoVideo,
                                               @RequestParam int duration,
                                               HttpServletRequest request) {
        try {
            System.out.println("inside create course method...\n");
            String authorizationHeader = request.getHeader("Authorization");

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwtToken = authorizationHeader.substring(7);

                if (document.isEmpty() || !document.getContentType().equals("application/pdf")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid document format. Only PDF files are allowed.");
                }

                if (thumbnail.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("thumbnail is not provided");
                }

                try {


                    String documentName = System.currentTimeMillis() + "_" + document.getOriginalFilename();
                    Path documentPath = Paths.get("./documents/" + documentName);

                    String thumbnailName = System.currentTimeMillis() + "_" + thumbnail.getOriginalFilename();
                    Path thumbnailPath = Paths.get("./thumbnails/" + thumbnailName);

                    String demoVideoName = System.currentTimeMillis() + "_" + demoVideo.getOriginalFilename();
                    Path demoVideoPath = Paths.get("./video/" + demoVideoName);


//                    File vFolder = new File("./video");
//                    if (!vFolder.exists()) {
//                        Files.createDirectories(demoVideoPath.getParent());
//                    }
                    File folder = new File("./documents");

                    if (!folder.exists()) {
                        Files.createDirectories(documentPath.getParent());
                    }

                    File thumbnailFolder = new File("./thumbnails");

                    if (!thumbnailFolder.exists()) {
                        Files.createDirectories(thumbnailPath.getParent());
                    }

                    Files.write(documentPath, document.getBytes());
                    Files.write(thumbnailPath, thumbnail.getBytes());
//                    Files.write(demoVideoPath, demoVideo.getBytes());

                    String documentUrl = documentPath.toAbsolutePath().toString();
                    String thumbnailUrl = thumbnailPath.toAbsolutePath().toString();
//                    String demoVideoUrl = demoVideoPath.toString();

//                    Path videoPath = Paths.get("./video");
                    String s = this.videoService.processDummyVideo(demoVideo);

                    // Call service method with updated document URL
                    this.courseService.create(courseName, description, price,
                            categoryId, jwtToken, documentName, thumbnailName,s,duration);


                    return ResponseEntity.status(HttpStatus.CREATED).body("Course created successfully");

                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while saving the document.");
                }

            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization header is missing or invalid.");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/remove-bookmark/{courseId}/{userId}")
    public ResponseEntity<Map<String,String>> removeCourseFromBookMark(@PathVariable int courseId,@PathVariable int userId)
    {
        Map<String ,String > response = new HashMap<>();
        boolean flag = courseService.removeFromBookMark(courseId,userId);

        if(flag)
        {
            response.put("message","Course removed succesfully");

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
        response.put("message","can not remove right now ! please try again later");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<Map<String,String>> updateCourse(@RequestBody Course course,@PathVariable int courseId)
    {
        Map<String,String> response = new HashMap<>();
        try{

            courseService.updateCourseById(course,courseId);
            response.put("message","course updated succesfully");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e)
        {
            response.put("message","course can not be updated");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/bookmark/{courseId}/{userId}")
    public ResponseEntity<Map<String,String>> bookMarkCourse(@PathVariable int courseId,@PathVariable int userId)
    {
        Map<String ,String > response = new HashMap<>();
        boolean flag = courseService.bookMarkCourse(courseId,userId);

        if(flag)
        {
            response.put("message","Course Bookmarked succesfully");

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
        response.put("message","can not bookmark right now ! please try again later");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

    }

/*
    @PostMapping("/")
    public ResponseEntity<String> createCourse(
            @RequestParam String courseName,
            @RequestParam String description,
            @RequestParam float price,
            @RequestParam int categoryId,
            @RequestParam MultipartFile document,
            @RequestParam MultipartFile thumbnail,
            HttpServletRequest request) {

        try {
            System.out.println("Inside create course method...\n");

            // Validate Authorization Header
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization header is missing or invalid.");
            }
            String jwtToken = authorizationHeader.substring(7);

            // Validate Document
            if (document.isEmpty() || !document.getContentType().equals("application/pdf")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid document format. Only PDF files are allowed.");
            }
            if (thumbnail.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thumbnail is not provided.");
            }

            // Upload files to Azure Blob Storage
            String documentUrl = uploadFileToAzure(document, documentsContainer);
            String thumbnailUrl = uploadFileToAzure(thumbnail, thumbnailsContainer);

            // Save Course Details
            courseService.create(courseName, description, price, categoryId, jwtToken, documentUrl, thumbnailUrl);

            return ResponseEntity.status(HttpStatus.CREATED).body("Course created successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while creating the course.");
        }
    }

    private String uploadFileToAzure(MultipartFile file, String containerName) throws IOException {
        // Create Blob Service Client
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder().connectionString(connectionString).buildClient();

        // Ensure Container Exists (Create if not exists)
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        if (!containerClient.exists()) {
            containerClient.create();
        }

        // Generate Unique File Name
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Upload File
        BlobClient blobClient = containerClient.getBlobClient(fileName);
        blobClient.upload(file.getInputStream(), file.getSize(), true);

        // Return Blob URL
        return blobClient.getBlobUrl();
    }



 */

}

//Hello world