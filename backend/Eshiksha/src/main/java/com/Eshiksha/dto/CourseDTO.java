package com.Eshiksha.dto;

public class CourseDTO {
    private String courseName;
    private String description;
    private float price;
    private String dummy;
    private int categoryId;

    public CourseDTO(String courseName, String description, float price, String dummy, int categoryId) {
        this.courseName = courseName;
        this.description = description;
        this.price = price;
        this.dummy = dummy;
        this.categoryId = categoryId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getDummy() {
        return dummy;
    }

    public void setDummy(String dummy) {
        this.dummy = dummy;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public String toString() {
        return "CourseDTO{" +
                "courseName='" + courseName + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", dummy='" + dummy + '\'' +
                ", categoryId=" + categoryId +
                '}';
    }
}
