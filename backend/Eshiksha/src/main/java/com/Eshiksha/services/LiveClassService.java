package com.Eshiksha.services;

import com.Eshiksha.Entities.LiveClass;
import com.Eshiksha.dto.LiveClassDTO;

import java.util.List;

public interface LiveClassService {
    LiveClass createLiveClass(LiveClassDTO liveClassDTO);
    List<LiveClass> getAllLiveClassesByCourse(int courseId);

    List<LiveClass> getAllLiveClassesByTeacher(int teacherId);
    List<LiveClass> getAllLiveClassesByStudent(int studentId);

    boolean deleteLiveClass(int liveClassId);

    LiveClass updateLiveClass(int liveClassId, LiveClassDTO liveClassDetails);
}
