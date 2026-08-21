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
public class WorkOrder {
    private String orderId;
    private String productFamily;
    @Builder.Default
    private int priority = 1; // 1 = Normal, 2 = High, 3 = Urgent
    private double dueDateHour;
    @Builder.Default
    private List<String> operationIds = new ArrayList<>();
}
