package com.capstone.project.myPage.entity;

import com.capstone.project.member.entity.Member;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "mypage")
public class Mypage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mypage_id")
    private Integer mypageId;

    @Column(name = "mypage_content")
    private String mypageContent;

    @OneToMany(mappedBy = "mypage", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Skill> skillList = new ArrayList<>(); // ✅ 초기화 추가

    @OneToMany(mappedBy = "mypage", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Career> careerList = new ArrayList<>(); // ✅ 초기화 추가

    @OneToMany(mappedBy = "mypage", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Education> educationList = new ArrayList<>(); // ✅ 초기화 추가

    @OneToOne
    @JoinColumn(name = "member_id")
    @JsonIgnore
    private Member member; // 회원과의 관계 추가
}
