package com.Eshiksha.Entities;

import jakarta.persistence.*;

@Entity
public class DoubtSolution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String solution;

    @OneToOne
    private Teacher solver;

    @OneToOne
    private LessionDoubt doubt;

    public DoubtSolution() {
    }


    public DoubtSolution(int id, String solution, Teacher solver, LessionDoubt doubt) {
        this.id = id;
        this.solution = solution;
        this.solver = solver;
        this.doubt = doubt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSolution() {
        return solution;
    }

    public void setSolution(String solution) {
        this.solution = solution;
    }

    public Teacher getSolver() {
        return solver;
    }

    public void setSolver(Teacher solver) {
        this.solver = solver;
    }

    public LessionDoubt getDoubt() {
        return doubt;
    }

    public void setDoubt(LessionDoubt doubt) {
        this.doubt = doubt;
    }
}
