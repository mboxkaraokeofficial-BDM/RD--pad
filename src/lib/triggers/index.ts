import { MockController } from './mock'
import { WebSocketController } from './websocket'
import type { KaraokeController } from './types'

// Switch between mock ↔ production here (or via env var)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export const controller: KaraokeController = USE_MOCK
  ? MockController
  : WebSocketController

export type { KaraokeController }
