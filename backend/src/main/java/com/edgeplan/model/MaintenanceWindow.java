package com.edgeplan.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceWindow {
    private String maintenanceId;
    private String resourceId;
    private double startHour;
    private double endHour;
    private String description;
}
