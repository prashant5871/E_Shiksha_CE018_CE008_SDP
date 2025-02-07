package com.Eshiksha.services;

import com.Eshiksha.Entities.Lession;

public interface LessionService {
    public void saveLession(Lession lession);

    public Lession findLessionById(int lessionId);
}
