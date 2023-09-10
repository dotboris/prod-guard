import { type WarningWithId, type Warning } from '../warnings'
import { v4 as uuidV4 } from 'uuid'
import { omit } from 'lodash-es'

/**
 * Current state version. The state is versioned using a number. The first
 * version is `0` and gets incremented with every upgrade.
 */
export const CURRENT_STATE_VERSION = 3

export class State {
  dataVersion = CURRENT_STATE_VERSION
  warnings = new Map<string, Warning>()

  constructor(initialWarnings: WarningWithId[] = []) {
    this.warnings = new Map(
      initialWarnings.map((w) => [w.id, omit(w, 'id') as Warning]),
    )
  }

  private uniqueWarningId(): string {
    let candidate: string
    do {
      candidate = uuidV4()
    } while (this.warnings.has(candidate))

    return candidate
  }

  addWarning(warning: Warning): WarningWithId {
    const id = this.uniqueWarningId()
    this.warnings.set(id, warning)
    return { ...warning, id }
  }

  getWarning(id: string): WarningWithId | undefined {
    const res = this.warnings.get(id)
    if (res === undefined) {
      return undefined
    } else {
      return { ...res, id }
    }
  }

  getAllWarnings(): WarningWithId[] {
    return Array.from(this.warnings).map(([id, warning]) => ({
      ...warning,
      id,
    }))
  }

  removeWarning(id: string): WarningWithId | undefined {
    const res = this.getWarning(id)
    this.warnings.delete(id)
    return res
  }

  updateWarning(id: string, warning: Warning): void {
    if (this.warnings.has(id)) {
      this.warnings.set(id, warning)
    }
  }

  findMatchingWarnings(url: string): WarningWithId[] {
    return this.getAllWarnings().filter((warning) => url.match(warning.pattern))
  }
}
