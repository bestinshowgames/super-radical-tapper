export type HEX = `#${string}`;

export default interface CueConfiguration {
  id: string;
  x: number;
  y: number;
  radius: number;
  baseColor?: HEX;
  highlightColor?: HEX;
  successColor?: HEX;
  failureColor?: HEX;
  text?: string;
}
