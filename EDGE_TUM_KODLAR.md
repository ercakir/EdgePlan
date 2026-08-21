# EdgePlan-AI — Complete Codebase Specification & Full Source Code

This artifact provides the complete technical architecture and full source code of the **EdgePlan-AI** Enterprise Hybrid Production Planning & AI Agent Optimization Platform.

---

## 📁 Project Directory Structure

```text
edgeplan-ai-roadmap/
├── run_app.bat                                 # Windows Single-Click Launcher
├── pyproject.toml                              # Project configuration & dependencies
├── setup.py                                    # Package setup
├── README.md                                   # Documentation & guide
├── edgeplan_uretim_raporu.pdf                 # Executive PDF Export Output
├── scratch/
│   ├── test_pipeline.py                       # Automated E2E verification test suite
│   ├── test_5_samples.py                      # 5 Verified sample instruction test suite
│   └── generate_pdf.py                        # PDF generator execution script
├── data/
│   └── processed/
│       └── privacy_transformed_dense_week/    # Active factory dataset (CSV files)
│           ├── work_orders.csv
│           ├── operations.csv
│           ├── resources.csv
│           ├── precedence.csv
│           └── maintenance.csv
└── src/
    └── edgeplan/
        ├── __init__.py
        ├── models/
        │   ├── __init__.py
        │   ├── domain.py                      # Deterministic physical domain models
        │   ├── constraints.py                 # Validated merged constraints & audit log models
        │   ├── intent.py                       # Natural language intent & override models
        │   └── schedule.py                     # Optimization schedule & solver metric models
        ├── services/
        │   ├── __init__.py
        │   ├── deterministic_extractor.py     # Deterministic Python constraint extractor
        │   ├── llm_service.py                 # Intent inference service & heuristic fallback
        │   ├── override_compiler.py           # Override compiler & fuzzy grounding engine
        │   ├── solver_service.py              # OR-Tools CP-SAT solver service
        │   ├── ai_agent_advisor.py            # AI Executive Advisor & remediation service
        │   └── delta_calculator.py            # Plus/Minus (+/-) Machine load delta calculator
        ├── utils/
        │   ├── __init__.py
        │   ├── pdf_generator.py               # ReportLab High-Quality PDF exporter
        │   ├── sample_data_generator.py       # Auto-sample factory dataset generator
        │   └── visualizer.py                  # Plotly Gantt, Workload & Density charts
        └── ui/
            ├── __init__.py
            └── streamlit_app.py               # Enterprise SaaS Streamlit User Interface
```

---

## 1. Core Domain & Data Models (`src/edgeplan/models/`)

### `domain.py`
```python
"""Domain models representing deterministic physical factory facts."""

from pydantic import BaseModel, Field


class Resource(BaseModel):
    resource_id: str
    name: str
    capacity: float = 1.0
    efficiency_factor: float = 1.0
    cost_per_hour: float = 100.0


class Operation(BaseModel):
    operation_id: str
    order_id: str
    sequence_index: int
    name: str
    duration_hours: float
    eligible_resource_ids: list[str]
    setup_time_hours: float = 0.0


class MaintenanceWindow(BaseModel):
    maintenance_id: str
    resource_id: str
    start_hour: float
    end_hour: float
    description: str = ""


class PrecedenceRelation(BaseModel):
    predecessor_op_id: str
    successor_op_id: str
    min_lag_hours: float = 0.0


class WorkOrder(BaseModel):
    order_id: str
    product_family: str
    priority: int = 1  # 1 = normal, 2 = high, 3 = urgent
    due_date_hour: float
    operation_ids: list[str] = Field(default_factory=list)


class FactoryPlanningContext(BaseModel):
    dataset_path: str
    orders: dict[str, WorkOrder] = Field(default_factory=dict)
    operations: dict[str, Operation] = Field(default_factory=dict)
    resources: dict[str, Resource] = Field(default_factory=dict)
    maintenance_windows: list[MaintenanceWindow] = Field(default_factory=list)
    precedences: list[PrecedenceRelation] = Field(default_factory=list)

    @property
    def order_allow_list(self) -> set[str]:
        return set(self.orders.keys())

    @property
    def operation_allow_list(self) -> set[str]:
        return set(self.operations.keys())

    @property
    def resource_allow_list(self) -> set[str]:
        return set(self.resources.keys())
```

---

### `constraints.py`
```python
"""Models for validated merged constraints, audit logs, and conflict resolution."""

from enum import Enum
from typing import Any
from pydantic import BaseModel, Field
from edgeplan.models.intent import PlanningOverride


class GroundingStatus(str, Enum):
    GROUNDED = "GROUNDED"
    NOT_FOUND_IN_ALLOWLIST = "NOT_FOUND_IN_ALLOWLIST"


class PhysicalCompatibility(str, Enum):
    COMPATIBLE = "COMPATIBLE"
    PHYSICAL_VIOLATION = "PHYSICAL_VIOLATION"
    PRECEDENCE_VIOLATION = "PRECEDENCE_VIOLATION"


class OverrideRiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class OverrideValidationResult(BaseModel):
    override: PlanningOverride
    grounding_status: GroundingStatus
    physical_compatibility: PhysicalCompatibility
    is_accepted: bool
    rejection_reason: str = ""
    risk_level: OverrideRiskLevel = OverrideRiskLevel.LOW


class MergedConstraint(BaseModel):
    constraint_id: str
    constraint_type: str
    target_id: str
    description: str
    details: Any = None
    origin: str  # "DETERMINISTIC_PYTHON" or "APPROVED_USER_OVERRIDE"


class MergedConstraintSet(BaseModel):
    deterministic_constraints: list[MergedConstraint] = Field(default_factory=list)
    approved_user_constraints: list[MergedConstraint] = Field(default_factory=list)

    @property
    def all_constraints(self) -> list[MergedConstraint]:
        return self.deterministic_constraints + self.approved_user_constraints


class AuditLog(BaseModel):
    validation_results: list[OverrideValidationResult] = Field(default_factory=list)
    rejected_count: int = 0
    accepted_count: int = 0
    raw_prompt: str = ""
    raw_response: str = ""
    conflict_resolution_notes: list[str] = Field(default_factory=list)
```

---

### `intent.py`
```python
"""Models for natural language instructions, semantic intents, and planning overrides."""

from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel, Field


class IntentType(str, Enum):
    URGENT = "urgent"
    NO_DELAY = "no_delay"
    PREFERRED_MACHINE = "preferred_machine"
    DURATION_OVERRIDE = "duration_override"
    FIXED_ASSIGNMENT = "fixed_assignment"


class FallbackPolicy(str, Enum):
    STOP = "stop"
    CONTINUE_DETERMINISTIC = "continue_deterministic"


class UserPlanningInstruction(BaseModel):
    user_text: str
    llm_url: str = "http://localhost:8080"
    model_name: str = "gemma-2-9b-it"
    confidence_threshold: float = 0.7
    fallback_policy: FallbackPolicy = FallbackPolicy.CONTINUE_DETERMINISTIC


class SemanticIntent(BaseModel):
    intent_type: IntentType
    target_type: str
    target_id: str
    value: Optional[Any] = None
    confidence: float = 1.0
    reasoning: str = ""


class PlanningOverride(BaseModel):
    override_id: str
    target_type: str
    target_id: str
    proposed_attribute: str
    proposed_value: Any
    confidence: float = 1.0
    rationale: str = ""


class BusinessIntentSet(BaseModel):
    raw_text: str
    intents: list[SemanticIntent] = Field(default_factory=list)
    proposed_overrides: list[PlanningOverride] = Field(default_factory=list)
    raw_llm_prompt: str = ""
    raw_llm_response: str = ""
    execution_status: str = "SUCCESS"
    error_message: Optional[str] = None
```

---

### `schedule.py`
```python
"""Models for optimization schedule output, solver metrics, and task assignments."""

from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel, Field


class SolverStatus(str, Enum):
    OPTIMAL = "OPTIMAL"
    FEASIBLE = "FEASIBLE"
    INFEASIBLE = "INFEASIBLE"
    UNKNOWN = "UNKNOWN"


class ScheduledTask(BaseModel):
    operation_id: str
    order_id: str
    operation_name: str
    resource_id: str
    resource_name: str
    start_hour: float
    end_hour: float
    duration_hours: float
    due_date_hour: float
    is_tardy: bool = False
    lateness_hours: float = 0.0


class OptimizationMetrics(BaseModel):
    makespan_hours: float = 0.0
    tardy_order_count: int = 0
    total_tardiness_hours: float = 0.0
    total_machine_utilization_pct: float = 0.0
    solver_solve_time_seconds: float = 0.0
    scheduled_task_count: int = 0


class ScheduleResult(BaseModel):
    solver_status: SolverStatus
    run_type: str = "BASELINE"
    objective_type: str = "makespan"
    metrics: OptimizationMetrics = Field(default_factory=OptimizationMetrics)
    tasks: list[ScheduledTask] = Field(default_factory=list)
    raw_schedule_json: dict[str, Any] = Field(default_factory=dict)
    infeasibility_explanation: Optional[str] = None
```

---

## 2. Core Backend Services (`src/edgeplan/services/`)

### `delta_calculator.py`
```python
"""Schedule Delta & Machine Workload Shift Calculator (+ / -)."""

from typing import Any
from edgeplan.models.domain import FactoryPlanningContext
from edgeplan.models.schedule import ScheduleResult


class ScheduleDeltaCalculator:
    """Calculates plus/minus (+/-) machine workload and KPI deltas between two schedule runs."""

    def calculate_deltas(
        self,
        base_schedule: ScheduleResult,
        custom_schedule: ScheduleResult,
        context: FactoryPlanningContext,
    ) -> dict[str, Any]:
        """Calculates detailed machine workload shifts (+ / -) and KPI differences."""
        if not base_schedule or not custom_schedule or not context:
            return {}

        base_makespan = base_schedule.metrics.makespan_hours
        custom_makespan = custom_schedule.metrics.makespan_hours
        makespan_delta = custom_makespan - base_makespan

        base_tardy = base_schedule.metrics.tardy_order_count
        custom_tardy = custom_schedule.metrics.tardy_order_count
        tardy_delta = custom_tardy - base_tardy

        base_util = base_schedule.metrics.total_machine_utilization_pct
        custom_util = custom_schedule.metrics.total_machine_utilization_pct
        util_delta = custom_util - base_util

        base_res_hours: dict[str, float] = {}
        base_res_tasks: dict[str, int] = {}
        for t in base_schedule.tasks:
            base_res_hours[t.resource_id] = base_res_hours.get(t.resource_id, 0.0) + t.duration_hours
            base_res_tasks[t.resource_id] = base_res_tasks.get(t.resource_id, 0) + 1

        custom_res_hours: dict[str, float] = {}
        custom_res_tasks: dict[str, int] = {}
        for t in custom_schedule.tasks:
            custom_res_hours[t.resource_id] = custom_res_hours.get(t.resource_id, 0.0) + t.duration_hours
            custom_res_tasks[t.resource_id] = custom_res_tasks.get(t.resource_id, 0) + 1

        machine_deltas: list[dict[str, Any]] = []

        for r_id, res in context.resources.items():
            b_h = base_res_hours.get(r_id, 0.0)
            c_h = custom_res_hours.get(r_id, 0.0)
            d_h = round(c_h - b_h, 1)

            b_u = round((b_h / max(base_makespan, 1.0)) * 100, 1)
            c_u = round((c_h / max(custom_makespan, 1.0)) * 100, 1)
            d_u = round(c_u - b_u, 1)

            b_t = base_res_tasks.get(r_id, 0)
            c_t = custom_res_tasks.get(r_id, 0)
            d_t = c_t - b_t

            delta_h_str = f"+{d_h:.1f} Sa" if d_h > 0 else (f"{d_h:.1f} Sa" if d_h < 0 else "0.0 Sa")
            delta_u_str = f"+{d_u:.1f}%" if d_u > 0 else (f"{d_u:.1f}%" if d_u < 0 else "0.0%")
            delta_t_str = f"+{d_t} Op" if d_t > 0 else (f"{d_t} Op" if d_t < 0 else "0 Op")

            machine_deltas.append({
                "resource_id": r_id,
                "resource_name": res.name,
                "base_hours": b_h,
                "custom_hours": c_h,
                "delta_hours": d_h,
                "delta_hours_str": delta_h_str,
                "base_util_pct": b_u,
                "custom_util_pct": c_u,
                "delta_util_pct": d_u,
                "delta_util_str": delta_u_str,
                "base_task_count": b_t,
                "custom_task_count": c_t,
                "delta_task_count": d_t,
                "delta_task_str": delta_t_str,
            })

        return {
            "metrics_delta": {
                "makespan_delta": makespan_delta,
                "makespan_delta_str": f"+{makespan_delta:.1f} Sa" if makespan_delta > 0 else f"{makespan_delta:.1f} Sa",
                "tardy_delta": tardy_delta,
                "tardy_delta_str": f"+{tardy_delta} Adet" if tardy_delta > 0 else f"{tardy_delta} Adet",
                "util_delta": util_delta,
                "util_delta_str": f"+{util_delta:.1f}%" if util_delta > 0 else f"{util_delta:.1f}%",
            },
            "machine_deltas": machine_deltas,
        }
```

---

## 3. Windows Single-Click Launcher Script (`run_app.bat`)

```cmd
@echo off
title EdgePlan-AI Platform Launcher
color 0A
echo ========================================================
echo   EdgePlan-AI Platformu Tek Tikla Baslatiliyor...
echo ========================================================
echo.

cd /d "%~dp0"
set PYTHONPATH=src

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [HATA] Python sisteminizde yuklu bulunamadi!
    echo Lutfen Python 3.9+ yuklu oldugundan emin olun.
    pause
    exit /b 1
)

echo [1/2] Gerekli kütüphaneler kontrol ediliyor...
python -m pip install -q streamlit ortools reportlab plotly pandas pydantic ruff

echo [2/2] Streamlit Sunucusu Başlatılıyor (http://localhost:8501)...
echo.

python -m streamlit run src/edgeplan/ui/streamlit_app.py

pause
```
