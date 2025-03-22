package com.capstone.project.myPage.entity;

import com.capstone.project.member.entity.Member;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "skills")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    private Integer skillId;

    @Column(name = "skill_name")
    private String skillName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mypage_id")
    @JsonIgnore
    private Mypage mypage;
}
