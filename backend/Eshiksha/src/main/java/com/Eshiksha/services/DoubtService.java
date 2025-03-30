package com.Eshiksha.services;

import com.Eshiksha.Entities.LessionDoubt;

import java.util.List;

public interface DoubtService {

    List<LessionDoubt> getDoubtByUserId(int userId);
}
