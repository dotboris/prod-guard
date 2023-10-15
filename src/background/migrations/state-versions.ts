export interface StateVersions {
  /** The initial state before we started versioning it */
  0: {
    sites?: Array<{
      warningStyle: 'topBanner' | 'bottomBanner' | 'border'
      pattern: string
      text?: string
      backgroundColor?: string
      textColor?: string
      borderColor?: string
    }>
  }
  /** Add dataVersion & rename sites to warnings */
  1: {
    dataVersion: 1
    warnings: Array<{
      warningStyle: 'topBanner' | 'bottomBanner' | 'border'
      pattern: string
      text?: string
      backgroundColor?: string
      textColor?: string
      borderColor?: string
    }>
  }
  /** Add default values for warnings */
  2: {
    dataVersion: 2
    warnings: Array<
      | {
          warningStyle: 'topBanner' | 'bottomBanner'
          pattern: string
          text: string
          backgroundColor: string
          textColor: string
        }
      | {
          pattern: string
          warningStyle: 'border'
          borderColor: string
        }
    >
  }
  /** Add ids */
  3: {
    dataVersion: 3
    warnings: Array<
      | {
          warningStyle: 'topBanner' | 'bottomBanner'
          pattern: string
          id: string
          text: string
          backgroundColor: string
          textColor: string
        }
      | {
          warningStyle: 'border'
          pattern: string
          id: string
          borderColor: string
        }
    >
  }
  /** Add enabled flag */
  4: {
    dataVersion: 4
    warnings: Array<
      | {
          enabled: boolean
          warningStyle: 'topBanner' | 'bottomBanner'
          pattern: string
          id: string
          text: string
          backgroundColor: string
          textColor: string
        }
      | {
          enabled: boolean
          warningStyle: 'border'
          pattern: string
          id: string
          borderColor: string
        }
    >
  }
}
