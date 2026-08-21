package com.edgeplan.model;

import com.edgeplan.dto.DeltaCalculationResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResult {
    private String solverStatus; // OPTIMAL, FEASIBLE, INFEASIBLE
    private String runType; // BASELINE, OVERRIDE
    private String objectiveType;
    @Builder.Default
    private OptimizationMetrics metrics = new OptimizationMetrics();
    @Builder.Default
    private List<ScheduledTask> tasks = new ArrayList<>();
    private DeltaCalculationResult deltas;
    private String infeasibilityExplanation;
}
