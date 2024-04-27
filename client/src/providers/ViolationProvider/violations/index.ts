import FullScreenCloseViolation from "./FullScreenCloseViolation";

const VIOLATIONS = [new FullScreenCloseViolation()] as const;

export type ViolationCode = (typeof VIOLATIONS)[number]["code"];

export default VIOLATIONS;
