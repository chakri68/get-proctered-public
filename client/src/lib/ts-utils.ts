/**
 * A utility class for creating a pipeline of type-safe transformations on a value.
 *
 * @template P - The type of the initial value in the pipeline.
 */
export class Pipe<P> {
  /**
   * Creates a new instance of the Pipe class with an initial value.
   *
   * @param {P} value - The initial value in the pipeline.
   */
  constructor(private value: P) {}

  /**
   * Adds a transformation to the pipeline, applying the provided callback to the current value.
   *
   * @template Q - The type of the transformed value after applying the callback.
   * @param {(val: P) => Q} callback - The callback function to transform the current value.
   * @returns {Pipe<Q>} - A new Pipe instance with the transformed value.
   */
  then<Q>(callback: (val: P) => Q): Pipe<Q> {
    const val = callback(this.value);
    return new Pipe(val);
  }

  /**
   * Retrieves the final value from the pipeline.
   *
   * @returns {P} - The final value after all transformations in the pipeline.
   */
  val(): P {
    return this.value;
  }
}
