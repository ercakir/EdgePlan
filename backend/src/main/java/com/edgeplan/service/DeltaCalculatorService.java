package com.edgeplan.service;

import com.edgeplan.dto.DeltaCalculationResult;
import com.edgeplan.dto.MachineDelta;
import com.edgeplan.model.Resource;
import com.edgeplan.model.ScheduleResult;
import com.edgeplan.model.ScheduledTask;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DeltaCalculatorService {

    public DeltaCalculationResult calculateDeltas(ScheduleResult baseSchedule, ScheduleResult customSchedule, Map<String, Resource> resources) {
        if (baseSchedule == null || customSchedule == null) {
            return null;
        }

        double baseMakespan = Math.max(baseSchedule.getMetrics().getMakespanHours(), 1.0);
        double customMakespan = Math.max(customSchedule.getMetrics().getMakespanHours(), 1.0);
        double makespanDelta = customSchedule.getMetrics().getMakespanHours() - baseSchedule.getMetrics().getMakespanHours();

        int baseTardy = baseSchedule.getMetrics().getTardyOrderCount();
        int customTardy = customSchedule.getMetrics().getTardyOrderCount();
        int tardyDelta = customTardy - baseTardy;

        double baseUtil = baseSchedule.getMetrics().getTotalMachineUtilizationPct();
        double customUtil = customSchedule.getMetrics().getTotalMachineUtilizationPct();
        double utilDelta = customUtil - baseUtil;

        // Resource task aggregation
        Map<String, Double> baseResHours = new HashMap<>();
        Map<String, Integer> baseResTasks = new HashMap<>();
        for (ScheduledTask t : baseSchedule.getTasks()) {
            baseResHours.put(t.getResourceId(), baseResHours.getOrDefault(t.getResourceId(), 0.0) + t.getDurationHours());
            baseResTasks.put(t.getResourceId(), baseResTasks.getOrDefault(t.getResourceId(), 0) + 1);
        }

        Map<String, Double> customResHours = new HashMap<>();
        Map<String, Integer> customResTasks = new HashMap<>();
        for (ScheduledTask t : customSchedule.getTasks()) {
            customResHours.put(t.getResourceId(), customResHours.getOrDefault(t.getResourceId(), 0.0) + t.getDurationHours());
            customResTasks.put(t.getResourceId(), customResTasks.getOrDefault(t.getResourceId(), 0) + 1);
        }

        List<MachineDelta> machineDeltas = new ArrayList<>();

        for (Map.Entry<String, Resource> entry : resources.entrySet()) {
            String rId = entry.getKey();
            Resource res = entry.getValue();

            double bH = baseResHours.getOrDefault(rId, 0.0);
            double cH = customResHours.getOrDefault(rId, 0.0);
            double dH = Math.round((cH - bH) * 10.0) / 10.0;

            double bU = Math.round((bH / baseMakespan) * 100.0 * 10.0) / 10.0;
            double cU = Math.round((cH / customMakespan) * 100.0 * 10.0) / 10.0;
            double dU = Math.round((cU - bU) * 10.0) / 10.0;

            int bT = baseResTasks.getOrDefault(rId, 0);
            int cT = customResTasks.getOrDefault(rId, 0);
            int dT = cT - bT;

            String deltaHStr = (dH > 0 ? "+" : "") + String.format(Locale.US, "%.1f Sa", dH);
            String deltaUStr = (dU > 0 ? "+" : "") + String.format(Locale.US, "%.1f%%", dU);
            String deltaTStr = (dT > 0 ? "+" : "") + dT + " Op";

            machineDeltas.add(MachineDelta.builder()
                    .resourceId(rId)
                    .resourceName(res.getName())
                    .baseHours(bH)
                    .customHours(cH)
                    .deltaHours(dH)
                    .deltaHoursStr(deltaHStr)
                    .baseUtilPct(bU)
                    .customUtilPct(cU)
                    .deltaUtilPct(dU)
                    .deltaUtilStr(deltaUStr)
                    .baseTaskCount(bT)
                    .customTaskCount(cT)
                    .deltaTaskCount(dT)
                    .deltaTaskStr(deltaTStr)
                    .build());
        }

        Map<String, Object> metricsDelta = new LinkedHashMap<>();
        metricsDelta.put("makespanDelta", makespanDelta);
        metricsDelta.put("makespanDeltaStr", (makespanDelta > 0 ? "+" : "") + String.format(Locale.US, "%.1f Sa", makespanDelta));
        metricsDelta.put("tardyDelta", tardyDelta);
        metricsDelta.put("tardyDeltaStr", (tardyDelta > 0 ? "+" : "") + tardyDelta + " Adet");
        metricsDelta.put("utilDelta", utilDelta);
        metricsDelta.put("utilDeltaStr", (utilDelta > 0 ? "+" : "") + String.format(Locale.US, "%.1f%%", utilDelta));

        return DeltaCalculationResult.builder()
                .metricsDelta(metricsDelta)
                .machineDeltas(machineDeltas)
                .build();
    }
}
