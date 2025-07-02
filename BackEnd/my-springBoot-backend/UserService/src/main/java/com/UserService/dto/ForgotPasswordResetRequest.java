package com.UserService.dto;

import lombok.Data;

@Data
public class ForgotPasswordResetRequest {
    private String email;
    
    private boolean isVerified;
    
     private String newPassword;

    public ForgotPasswordResetRequest(String email, boolean isVerified, String newPassword) {
        this.email = email;
        this.isVerified = isVerified;
        this.newPassword = newPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
