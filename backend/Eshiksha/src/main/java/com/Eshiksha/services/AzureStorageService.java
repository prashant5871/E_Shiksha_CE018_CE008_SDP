package com.Eshiksha.services;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.azure.core.http.rest.PagedIterable;
import com.azure.storage.blob.*;
import com.azure.storage.blob.models.BlobItem;
import com.azure.storage.blob.specialized.BlockBlobClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

@Service
public class AzureStorageService {

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    private final String[] resolutions = {"360p", "480p", "720p", "1080p"};
    private final Map<String, String> resolutionMap = Map.of(
            "360p", "640x360",
            "480p", "854x480",
            "720p", "1280x720",
            "1080p", "1920x1080"
    );
    private BlobServiceClient blobServiceClient;

    public AzureStorageService(BlobServiceClient blobServiceClient) {
        this.blobServiceClient = blobServiceClient;
    }

    public void uploadFileToAzure(String fullPath, MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }

            // Split the fullPath into container name and blob folder path
            String[] pathParts = fullPath.split("/", 2);
            if (pathParts.length < 2) {
                throw new IllegalArgumentException("Invalid path. Must be in format: <container>/<folder_path>");
            }

            String containerName = pathParts[0];
            String folderPath = pathParts[1];

            // Ensure container exists
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
            if (!containerClient.exists()) {
                containerClient.create();
            }

            // Create full blob path: folderPath/filename
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String blobPath = folderPath + "/" + fileName;

            BlobClient blobClient = containerClient.getBlobClient(blobPath);

            // Upload file safely using ByteArrayInputStream
            byte[] fileBytes = file.getBytes();
            ByteArrayInputStream inputStream = new ByteArrayInputStream(fileBytes);
            blobClient.upload(inputStream, fileBytes.length, true); // overwrite if exists

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Azure", e);
        }
    }

    public byte[] fetchFileBytesFromAzure(String fullPath) {
        try {
            // Debug: Log full path
            System.out.println("📁 Full path: " + fullPath);

            // Split the fullPath into container and folder path
            String[] pathParts = fullPath.split("/", 2);
            if (pathParts.length < 2) {
                throw new IllegalArgumentException("Path must be in format: <container>/<folder_path>");
            }

            String containerName = pathParts[0];
            String folderPath = pathParts[1];

            System.out.println("🧩 Container: " + containerName);
            System.out.println("📂 Folder Path: " + folderPath);

            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
            if (!containerClient.exists()) {
                System.out.println("🚫 Container not found: " + containerName);
                throw new RuntimeException("Container does not exist");
            }

            // List blobs in the folder
            PagedIterable<BlobItem> blobItems = containerClient.listBlobsByHierarchy(folderPath + "/");
            System.out.println("🔍 Searching for blobs in: " + folderPath + "/");

            for (BlobItem blobItem : blobItems) {
                System.out.println("📦 Found blob item: " + blobItem.getName());
                if (blobItem.isPrefix() == null || !blobItem.isPrefix()) {
                    System.out.println("insdier the if of isPrefix");
                    BlobClient blobClient = containerClient.getBlobClient(blobItem.getName());

                    try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                        blobClient.downloadStream(outputStream);
                        System.out.println("✅ Successfully downloaded: " + blobItem.getName());
                        return outputStream.toByteArray();
                    }


                }
            }

            System.out.println("⚠️ No file found inside: " + folderPath + "/");
            return null;

        } catch (Exception e) {
            System.out.println("❌ Exception occurred while fetching blob:");
            e.printStackTrace();  // Print root cause
            throw new RuntimeException("Failed to fetch file from Azure", e);
        }
    }




    public String processAndUploadVideo(MultipartFile file, String containerName, int courseId)
            throws IOException, InterruptedException {

        Path tempDir = Files.createTempDirectory("video-temp");
        Path videoFilePath = tempDir.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        Files.write(videoFilePath, file.getBytes());

        for (String res : resolutions) {
            Files.createDirectories(tempDir.resolve(res));
        }

        ExecutorService executor = Executors.newFixedThreadPool(resolutions.length);
        for (String res : resolutions) {
            executor.submit(() -> processVideo(tempDir, videoFilePath.getFileName().toString(), res));
        }
        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.MINUTES);

        createMasterPlaylist(tempDir);

        // Upload to Azure
        uploadDirectoryToAzure(tempDir, containerName, "course_" + courseId);

        // Clean up
        Files.walk(tempDir)
                .sorted(Comparator.reverseOrder())
                .map(Path::toFile)
                .forEach(File::delete);

        return "Uploaded successfully to container: " + containerName + "/course_" + courseId;
    }

    private void processVideo(Path baseDir, String fileName, String resolution) {
        try {
            String size = resolutionMap.get(resolution);
            Path resPath = baseDir.resolve(resolution);
            String inputPath = baseDir.resolve(fileName).toString();
            String outputSegments = resPath.resolve("segment_%03d.ts").toString();
            String outputPlaylist = resPath.resolve("playlist.m3u8").toString();

            String cmd = String.format(
                    "ffmpeg -i \"%s\" -vf scale=%s -c:v libx264 -c:a aac -strict -2 " +
                            "-f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename \"%s\" \"%s\"",
                    inputPath, size, outputSegments, outputPlaylist
            );

            ProcessBuilder builder = new ProcessBuilder("cmd.exe", "/c", cmd);
            builder.redirectErrorStream(true);
            Process process = builder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("FFmpeg Output : " + line);
            }
            process.waitFor();
        } catch (Exception e) {
            throw new RuntimeException("Error processing video for " + resolution, e);
        }
    }

    private void createMasterPlaylist(Path baseDir) throws IOException {
        List<String> lines = new ArrayList<>();
        lines.add("#EXTM3U");

        for (String res : resolutions) {
            String bandwidth = switch (res) {
                case "360p" -> "800000";
                case "480p" -> "1400000";
                case "720p" -> "2800000";
                case "1080p" -> "5000000";
                default -> "1000000";
            };
            String size = resolutionMap.get(res);
            lines.add(String.format("#EXT-X-STREAM-INF:BANDWIDTH=%s,RESOLUTION=%s", bandwidth, size));
            lines.add(res + "/playlist.m3u8");
        }

        Path masterPath = baseDir.resolve("master.m3u8");
        Files.write(masterPath, lines);
    }

    private void uploadDirectoryToAzure(Path localDir, String mainContainer, String courseFolder) {
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(mainContainer);
        if (!containerClient.exists()) {
            containerClient.create();
        }

        try {
            Files.walk(localDir)
                    .filter(Files::isRegularFile)
                    .forEach(path -> {
                        String relativePath = localDir.relativize(path).toString().replace("\\", "/");
                        String blobPath = courseFolder + "/" + relativePath;
                        BlockBlobClient blobClient = containerClient.getBlobClient(blobPath).getBlockBlobClient();
                        try {
                            InputStream fileStream = new BufferedInputStream(Files.newInputStream(path));
                            blobClient.upload(fileStream, Files.size(path), true);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    });
        } catch (IOException e) {
            throw new RuntimeException("Error uploading directory to Azure", e);
        }
    }
}

