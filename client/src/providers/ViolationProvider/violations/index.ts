import FullScreenCloseViolation from "./FullScreenCloseViolation";
import RightClickHandler from "./RightClickHandler";
import TabChangeHandler from "./KeyboardDisabler";
import KeyboardDisabler from "./KeyboardDisabler";

const VIOLATIONS = [
  new FullScreenCloseViolation(),
  new RightClickHandler(),
  new KeyboardDisabler(),
] as const;

export type ViolationCode =
  | (typeof VIOLATIONS)[number]["code"]
  | "FACE_NOT_FOUND"
  | "TOO_MANY_FACES"
  | "PHONE_DETECTED"
  | "FACE_NOT_MATCHED";

export default VIOLATIONS;
