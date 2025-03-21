package com.capstone.project.oauth2.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2LoginRequestDto {
    private String email;
    private String name;
    private String provider;
    private String providerId;
}