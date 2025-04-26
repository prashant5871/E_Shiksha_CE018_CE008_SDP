package com.Eshiksha.dto;

public class CourseReviewDTO {

    private int star;
    private String comment;

    public CourseReviewDTO(int star, String comment) {
        this.star = star;
        this.comment = comment;
    }

    public int getStar() {
        return star;
    }

    public void setStar(int star) {
        this.star = star;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
