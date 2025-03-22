package com.capstone.project.myPage.entity;

import com.capstone.project.member.entity.Member;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "educations")
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "education_id")
    private Integer educationId;

    @Column(name = "school_name")
    private String schoolName;

    @Column(name = "degree")
    private String degree;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mypage_id")
    @JsonIgnore
    private Mypage mypage;
}
