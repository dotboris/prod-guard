import {
  type WarningWithId,
  type Warning,
  CURRENT_DATA_VERSION,
  type AllData,
} from '../schema'
import { v4 as uuidV4 } from 'uuid'
import { omit } from 'lodash-es'

export class State {
  dataVersion = CURRENT_DATA_VERSION
  warnings = new Map<string, Warning>()

  constructor(allData: AllData) {
    this.importAllData(allData)
  }

  importAllData(allData: AllData): void {
    this.warnings = new Map(
      allData.warnings.map((w) => [w.id, omit(w, 'id') as Warning]),
    )
  }

  exportAllData(): AllData {
    return {
      dataVersion: CURRENT_DATA_VERSION,
      warnings: this.getAllWarnings(),
    }
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
