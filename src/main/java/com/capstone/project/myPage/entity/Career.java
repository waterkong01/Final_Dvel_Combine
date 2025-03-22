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
@Table(name = "careers")

public class Career {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "career_id")
    private Integer careerId;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "job_name")
    private String jobName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mypage_id")
    @JsonIgnore
    private Mypage mypage;
}
