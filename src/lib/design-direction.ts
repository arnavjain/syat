export type DesignDirectionId = "annotated-evidence" | "warm-commons" | "signal-garden";

export type DesignDirection = {
  id: DesignDirectionId;
  label: string;
  className: string;
  description: string;
};

const directions: Record<DesignDirectionId, DesignDirection> = {
  "annotated-evidence": {
    id: "annotated-evidence",
    label: "Annotated Evidence",
    className: "direction-evidence",
    description: "Sharper evidence markers, open corners, and a clear change spine."
  },
  "warm-commons": {
    id: "warm-commons",
    label: "Warm Commons",
    className: "direction-warm",
    description: "Rounded, colourful editorial surfaces for slower, more comfortable reading."
  },
  "signal-garden": {
    id: "signal-garden",
    label: "Signal Garden",
    className: "direction-garden",
    description: "A media-forward composition with visible source trails and layered context."
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
