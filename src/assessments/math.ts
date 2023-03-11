export const rad_2_deg = (rad: number) => {
  return (rad * 180) / Math.PI;
};
export const deg_2_rad = (deg: number) => {
  return (deg * Math.PI) / 180;
};

export interface Vec2D {
  x: number;
  y: number;
}

export const vecBetween = (a: Vec2D, b: Vec2D) => {
  return {
    x: b.x - a.x,
    y: b.y - a.y,
  };
};

export const calculateAngleBetweenVectors = (
  a: Vec2D,
  b: Vec2D,
  ignoreDirection: boolean = true
) => {
  //find vector components
  const dot = a.x * b.x + a.y * b.y;
  const magA = Math.sqrt(a.x * a.x + a.y * a.y);
  const magB = Math.sqrt(b.x * b.x + b.y * b.y);
  const rad = Math.acos(dot / (magA * magB));
  const deg = rad_2_deg(rad);
  if (ignoreDirection) {
    return Math.min(deg, 180 - deg);
  }
  return deg;
};

export const sameSign = (a: number, b: number) => {
  return (a >= 0 && b >= 0) || (a <= 0 && b <= 0);
};

export const midPoint = (a: Vec2D, b: Vec2D) => {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
};
