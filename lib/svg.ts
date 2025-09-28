/**
 * SVG utilities for bracelet path calculations and charm positioning
 */

export interface Point {
  x: number;
  y: number;
}

export interface PathInfo {
  totalLength: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
}

/**
 * Calculate pixels per millimeter ratio for scaling
 */
export function computePxPerMm(viewBoxLengthPx: number, physicalLengthMm: number): number {
  if (physicalLengthMm <= 0) {
    throw new Error("physicalLengthMm must be greater than 0");
  }
  return viewBoxLengthPx / physicalLengthMm;
}

/**
 * Parse SVG path commands to extract basic path information
 * Note: This is a simplified parser for basic path operations
 */
export function parsePathInfo(pathData: string): PathInfo {
  // Simple heuristic to estimate path bounds
  // In a real implementation, you'd use a proper SVG path parser
  const numbers = pathData.match(/-?\d*\.?\d+/g);
  
  if (!numbers || numbers.length === 0) {
    return { totalLength: 1000, viewBoxWidth: 1000, viewBoxHeight: 300 };
  }
  
  const coords = numbers.map(n => parseFloat(n));
  const xCoords = coords.filter((_, i) => i % 2 === 0);
  const yCoords = coords.filter((_, i) => i % 2 === 1);
  
  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);
  
  const width = maxX - minX;
  const height = maxY - minY;
  
  // Estimate path length (simplified)
  const totalLength = width * 1.5; // Rough approximation for curved paths
  
  return {
    totalLength,
    viewBoxWidth: width,
    viewBoxHeight: height,
  };
}

/**
 * Calculate position along a path given parameter t (0-1)
 * This would typically use the browser's SVG API in the client
 */
export function getPointAtLength(pathData: string, length: number): Point {
  // This is a placeholder - in the browser, you'd use:
  // const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  // path.setAttribute("d", pathData);
  // return path.getPointAtLength(length);
  
  // For server-side, we'll provide a simple approximation
  const pathInfo = parsePathInfo(pathData);
  const t = length / pathInfo.totalLength;
  
  // Simple quadratic curve approximation based on common bracelet shapes
  // This assumes the path is roughly: M start Q control end Q control start
  const startX = 10;
  const endX = 990;
  const controlY = 20;
  const baseY = 150;
  
  const x = startX + (endX - startX) * t;
  const y = baseY - Math.sin(t * Math.PI) * (baseY - controlY);
  
  return { x, y };
}

/**
 * Calculate tangent angle at a point on the path
 */
export function getTangentAngle(pathData: string, length: number): number {
  const pathInfo = parsePathInfo(pathData);
  const t = length / pathInfo.totalLength;
  
  // Simple approximation for tangent angle
  // In a real implementation, you'd calculate the derivative
  return Math.cos(t * Math.PI) * 90; // Approximate tangent angle in degrees
}

/**
 * Calculate normal vector (perpendicular to path) at a given point
 */
export function getNormalVector(pathData: string, length: number): Point {
  const angle = getTangentAngle(pathData, length);
  const normalAngle = (angle + 90) * (Math.PI / 180); // Convert to radians and rotate 90°
  
  return {
    x: Math.cos(normalAngle),
    y: Math.sin(normalAngle),
  };
}

/**
 * Convert millimeters to pixels based on physical bracelet length
 */
export function mmToPx(mm: number, physicalLengthMm: number, viewBoxLengthPx: number): number {
  const pxPerMm = computePxPerMm(viewBoxLengthPx, physicalLengthMm);
  return mm * pxPerMm;
}

/**
 * Convert pixels to millimeters
 */
export function pxToMm(px: number, physicalLengthMm: number, viewBoxLengthPx: number): number {
  const pxPerMm = computePxPerMm(viewBoxLengthPx, physicalLengthMm);
  return px / pxPerMm;
}

/**
 * Check if a point is within bounds of the SVG viewBox
 */
export function isPointInBounds(point: Point, width: number, height: number): boolean {
  return point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Rotate a point around origin by given angle in degrees
 */
export function rotatePoint(point: Point, angleDeg: number): Point {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  };
}