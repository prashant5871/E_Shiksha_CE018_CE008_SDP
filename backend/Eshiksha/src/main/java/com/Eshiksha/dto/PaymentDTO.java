package com.Eshiksha.dto;

public class PaymentDTO {
    private String debitCardNumber;

    private float amount;

    public PaymentDTO(float amount) {
        this.amount = amount;
    }

    public String getDebitCardNumber() {
        return debitCardNumber;
    }

    public void setDebitCardNumber(String debitCardNumber) {
        this.debitCardNumber = debitCardNumber;
    }

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }
}
