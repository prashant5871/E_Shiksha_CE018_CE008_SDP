package com.Eshiksha.services;

import com.Eshiksha.Entities.Lession;
import com.Eshiksha.repositories.LessionRepository;
import org.springframework.stereotype.Service;

@Service
public class LessionServiceImpl implements LessionService {
    private LessionRepository lessionRepository;

    public LessionServiceImpl(LessionRepository lessionRepository) {
        this.lessionRepository = lessionRepository;
    }

    @Override
    public void saveLession(Lession lession) {
        this.lessionRepository.save(lession);
    }

    @Override
    public Lession findLessionById(int lessionId) {
        return this.lessionRepository.findByLessionId(lessionId);
    }
}
