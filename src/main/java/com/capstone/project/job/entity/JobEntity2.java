package com.capstone.project.job.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "job")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class JobEntity2 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long job_list_id;

    private String company;
    private String title;
    private String link;
    private String job;
    private String location;

}
