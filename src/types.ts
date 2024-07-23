export interface Point {
  0: number;
  1: number;
}

export interface BoundingBox {
  0: Point;
  1: Point;
  2: Point;
  3: Point;
}

export interface TextDetection {
  bounding_box: BoundingBox;
  text: string;
  confidence: number;
}
