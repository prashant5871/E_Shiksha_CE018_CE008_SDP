package com.Eshiksha.services;

import com.Eshiksha.Entities.Lession;
import com.Eshiksha.Entities.LessionDoubt;
import org.springframework.web.multipart.MultipartFile;

import java.io.OutputStream;
import java.util.List;

public interface LessionService {
    public void saveLession(Lession lession);

    public Lession findLessionById(int lessionId);

    Lession createLession(int courseId, String title, String description, int sequenceNumber, String resources, String status, MultipartFile videoFile) throws Exception;


    List<Lession> getAllLessions();

    List<LessionDoubt> findDoubtsByLessonId(int lessonId);
}
