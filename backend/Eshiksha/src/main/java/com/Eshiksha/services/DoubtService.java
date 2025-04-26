package com.Eshiksha.services;

import com.Eshiksha.Entities.LessionDoubt;
import com.Eshiksha.dto.SolutionDTO;

import java.util.List;

public interface DoubtService {

    List<LessionDoubt> getDoubtsByUserIdAndCourseId(int userId,int courseId);

    void addSolution(int doubtId, SolutionDTO solutionDTO);
}
