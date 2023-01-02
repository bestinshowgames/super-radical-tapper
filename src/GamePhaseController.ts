export interface GamePhaseController {
  displayResults(): void;
  presentCue(cueKey: string): integer;
  waitForResponse(): integer;
}
