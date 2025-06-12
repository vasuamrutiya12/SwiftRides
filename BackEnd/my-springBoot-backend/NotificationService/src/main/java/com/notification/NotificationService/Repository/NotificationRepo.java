package com.notification.NotificationService.Repository;

import com.notification.NotificationService.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepo extends JpaRepository<Notification, Integer> {
}
