package com.edgeplan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MachineDelta {
    private String resourceId;
    private String resourceName;
    private double baseHours;
    private double customHours;
    private double deltaHours;
    private String deltaHoursStr;
    private double baseUtilPct;
    private double customUtilPct;
    private double deltaUtilPct;
    private String deltaUtilStr;
    private int baseTaskCount;
    private int customTaskCount;
    private int deltaTaskCount;
    private String deltaTaskStr;
}
