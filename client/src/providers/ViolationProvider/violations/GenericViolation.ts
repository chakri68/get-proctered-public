import { ViolationCode } from ".";
import Violation from "../Violation";

export default class GenericViolation<T extends ViolationCode>
  implements Violation<ViolationCode>
{
  code: T;
  instances: { timestamp: number; severity: "error" | "warning" }[] = [];
  callbacks: ((violation: GenericViolation<T>) => void)[] = [];

  constructor(code: T) {
    this.code = code;
  }

  setup() {
    throw new Error("Method not implemented.");
  }

  teardown() {
    throw new Error("Method not implemented.");
  }

  registerCallback(callback: (violation: Violation<ViolationCode>) => void) {
    this.callbacks.push(callback);
  }

  notify(instance: Violation<T>["instances"][number]) {
    this.callbacks.forEach((callback) => {
      callback(this);
    });
  }
}
