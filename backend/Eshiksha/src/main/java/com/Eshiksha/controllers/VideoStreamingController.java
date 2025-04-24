package com.Eshiksha.controllers;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/stream")
public class VideoStreamingController {

    private final BlobServiceClient blobServiceClient;

    private static final String CONTAINER_NAME = "courses"; // main bucket

    public VideoStreamingController(BlobServiceClient blobServiceClient) {
        this.blobServiceClient = blobServiceClient;
    }

    // Serve master.m3u8
    @GetMapping("/course/{courseId}/master.m3u8")
    public ResponseEntity<Resource> getMasterPlaylist(@PathVariable int courseId) {
        return serveBlob(courseId, "master.m3u8", null);
    }

    // Serve playlist.m3u8 for a specific resolution
    @GetMapping("/course/{courseId}/{resolution}/playlist.m3u8")
    public ResponseEntity<Resource> getVariantPlaylist(@PathVariable int courseId,
                                                       @PathVariable String resolution) {
        return serveBlob(courseId, "playlist.m3u8", resolution);
    }

    // Serve .ts segment for a specific resolution and segment file
    @GetMapping("/course/{courseId}/{resolution}/{segmentName}")
    public ResponseEntity<Resource> getSegment(@PathVariable int courseId,
                                               @PathVariable String resolution,
                                               @PathVariable String segmentName) {
        return serveBlob(courseId, segmentName, resolution);
    }

    /**
     * Shared method to fetch any blob from Azure.
     */
    private ResponseEntity<Resource> serveBlob(int courseId, String fileName, String resolutionFolder) {
        try {
            String blobPath = resolutionFolder == null
                    ? String.format("course_%d/%s", courseId, fileName)
                    : String.format("course_%d/%s/%s", courseId, resolutionFolder, fileName);

            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(CONTAINER_NAME);
            BlobClient blobClient = containerClient.getBlobClient(blobPath);

            if (!blobClient.exists()) {
                return ResponseEntity.notFound().build();
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            blobClient.download(outputStream);

            ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

            String contentType = getContentType(fileName);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=" + fileName)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    private String getContentType(String fileName) {
        if (fileName.endsWith(".m3u8")) return "application/vnd.apple.mpegurl";
        if (fileName.endsWith(".ts")) return "video/MP2T";
        return MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }
}

