package com.edgeplan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptimizationRequest {
    @Builder.Default
    private String objectiveType = "MAKESPAN"; // MAKESPAN, TARDINESS, BALANCED

    @Builder.Default
    private Map<String, Integer> priorityOverrides = new HashMap<>(); // orderId -> new priority

    @Builder.Default
    private Map<String, Double> durationOverrides = new HashMap<>(); // operationId -> new durationHours

    @Builder.Default
    private Map<String, String> machinePreferences = new HashMap<>(); // operationId -> preferred resourceId

    @Builder.Default
    private List<String> disabledResourceIds = new ArrayList<>();
}
