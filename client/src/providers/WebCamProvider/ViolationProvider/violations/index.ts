import FullScreenCloseViolation from "./FullScreenCloseViolation";
import RightClickHandler from "./RightClickHandler";
import TabChangeHandler from "./KeyboardDisabler";
import KeyboardDisabler from "./KeyboardDisabler";

const VIOLATIONS = [new FullScreenCloseViolation(), new RightClickHandler(), new KeyboardDisabler()] as const;

export type ViolationCode = (typeof VIOLATIONS)[number]["code"];

export default VIOLATIONS;
