package com.capstone.project.feed.repository;

import com.capstone.project.feed.entity.Feed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedRepository extends JpaRepository<Feed, Integer> {
    List<Feed> findByMemberId(Integer memberId);
}
