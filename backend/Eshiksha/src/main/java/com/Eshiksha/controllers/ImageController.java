package com.Eshiksha.controllers;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/images")
public class ImageController {

//    private final String imageDirectory = "D:/SEM-6/SDP/Project/E-Shiksha/backend/Eshiksha/thumbnails/";

    @GetMapping("/{folder}/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename,@PathVariable String folder) {
        try {
            Path filePath = Paths.get("./" + folder).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());


            if (resource.exists() || resource.isReadable()) {
                System.out.println("resource found succesfully...");
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                System.out.println("Inside elese");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("\n\n\ninside cath\n\n\n");
            return ResponseEntity.badRequest().build();
        }
    }
}
