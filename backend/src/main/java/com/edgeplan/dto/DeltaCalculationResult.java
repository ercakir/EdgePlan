package com.edgeplan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeltaCalculationResult {
    private Map<String, Object> metricsDelta;
    private List<MachineDelta> machineDeltas;
}
