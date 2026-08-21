package com.edgeplan.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
    private String resourceId;
    private String name;
    @Builder.Default
    private double capacity = 1.0;
    @Builder.Default
    private double efficiencyFactor = 1.0;
    @Builder.Default
    private double costPerHour = 100.0;
    @Builder.Default
    private boolean active = true;
}
