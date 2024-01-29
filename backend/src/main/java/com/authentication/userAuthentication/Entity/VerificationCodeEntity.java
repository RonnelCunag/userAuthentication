package com.authentication.userAuthentication.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class VerificationCodeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String verificationCode;
    private long expirationTimeInMillis;

    // Constructors
    public VerificationCodeEntity() {
        // Default constructor
    }

    public VerificationCodeEntity(String userEmail, String verificationCode, long expirationTimeInMillis) {
        this.userEmail = userEmail;
        this.verificationCode = verificationCode;
        this.expirationTimeInMillis = expirationTimeInMillis;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public long getExpirationTimeInMillis() {
        return expirationTimeInMillis;
    }

    public void setExpirationTimeInMillis(long expirationTimeInMillis) {
        this.expirationTimeInMillis = expirationTimeInMillis;
    }
}
