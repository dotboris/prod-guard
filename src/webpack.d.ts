declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.svg?data-uri' {
  const content: string
  export default content
}
