package com.edgeplan.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledTask {
    private String operationId;
    private String orderId;
    private String operationName;
    private String resourceId;
    private String resourceName;
    private double startHour;
    private double endHour;
    private double durationHours;
    private double dueDateHour;
    private boolean tardy;
    private double latenessHours;
}
