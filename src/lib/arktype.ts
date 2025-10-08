import type { ArkErrors } from "arktype";
import type { Result } from "neverthrow";
import { type } from "arktype";
import { err, ok } from "neverthrow";

export function wrapValidation<D>(
  out: D | ArkErrors,
): Result<D, ArkErrors> {
  if (out instanceof type.errors) {
    return err(out);
  }

  return ok(out);
}
