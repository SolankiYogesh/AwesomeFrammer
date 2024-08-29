interface MediaType {
  caption: string
  date: number // Use `number` for timestamps
  id: string
  media_url: string
  type: string // Use `string` if there are no fixed values; otherwise, use a union type
  thumbnail_url: string
}
interface TimePickerViewRef {
  getState: () => number | undefined
}
