package com.edgeplan.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptimizationMetrics {
    private double makespanHours;
    private int tardyOrderCount;
    private double totalTardinessHours;
    private double totalMachineUtilizationPct;
    private double solverSolveTimeSeconds;
    private int scheduledTaskCount;
}
