export type DesignDirectionId = "annotated-evidence" | "warm-commons" | "signal-garden";

export type DesignDirection = {
  id: DesignDirectionId;
  label: string;
  className: string;
  description: string;
  signature: "change-spine" | "subject-frame" | "credit-tray";
  signatureLabel: string;
};

const directions: Record<DesignDirectionId, DesignDirection> = {
  "annotated-evidence": {
    id: "annotated-evidence",
    label: "Annotated Evidence",
    className: "direction-evidence",
    description: "A visible change spine and open evidence lines for document-heavy stories.",
    signature: "change-spine",
    signatureLabel: "Change spine"
  },
  "warm-commons": {
    id: "warm-commons",
    label: "Warm Commons",
    className: "direction-warm",
    description: "A rounded subject frame and comfortable grouping around the same evidence.",
    signature: "subject-frame",
    signatureLabel: "Rounded subject frame"
  },
  "signal-garden": {
    id: "signal-garden",
    label: "Signal Garden",
    className: "direction-garden",
    description: "An authored media fixture with its complete credit and review state attached.",
    signature: "credit-tray",
    signatureLabel: "Authored media fixture"
  }
};

export function getDesignDirection(candidate: string | undefined): DesignDirection {
  if (candidate && candidate in directions) {
    return directions[candidate as DesignDirectionId];
  }

  return directions["warm-commons"];
}

export const designDirections = Object.values(directions);

export function isDesignDirection(candidate: string): candidate is DesignDirectionId {
  return candidate in directions;
}

export function getDesignDirectionStaticParams(): Array<{ direction: DesignDirectionId }> {
  return designDirections.map(({ id }) => ({ direction: id }));
}

export function getViewpointPositionClass(index: number, count: number): string {
  if (count < 2 || count > 8 || index < 0 || index >= count) {
    return "viewpoint-position viewpoint-position--fallback";
  }

  return `viewpoint-position viewpoint-position--${count}-${index + 1}`;
}

const syatFrameViewIds = ["whole", "commuter", "vendor", "access", "care"] as const;

export function selectSyatFrameView(current: string, requested: string): string {
  if (syatFrameViewIds.includes(requested as (typeof syatFrameViewIds)[number])) return requested;
  if (syatFrameViewIds.includes(current as (typeof syatFrameViewIds)[number])) return current;
  return "whole";
}
