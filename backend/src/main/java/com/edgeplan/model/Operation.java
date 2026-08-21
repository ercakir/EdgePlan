package com.edgeplan.model;

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
public class Operation {
    private String operationId;
    private String orderId;
    private int sequenceIndex;
    private String name;
    private double durationHours;
    @Builder.Default
    private List<String> eligibleResourceIds = new ArrayList<>();
    @Builder.Default
    private double setupTimeHours = 0.0;
}
