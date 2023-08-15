export const useViewportWidth = () => useState<number>('viewportWidth', () => 0)

export const useAppErrorMsgs = () => useState<string[]>('appErrorMsgs', () => [])
