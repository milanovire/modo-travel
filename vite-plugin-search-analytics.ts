import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'

type AnalyticsState = {
  totalSearches: number
  vibes: Record<string, number>
}

const FILE_PATH = path.resolve(process.cwd(), 'data', 'search-analytics.json')
const API_PATH = '/api/search-analytics'

function emptyState(): AnalyticsState {
  return { totalSearches: 0, vibes: {} }
}

function readState(): AnalyticsState {
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Partial<AnalyticsState>
    const totalSearches =
      typeof parsed.totalSearches === 'number' && Number.isFinite(parsed.totalSearches)
        ? Math.max(0, Math.floor(parsed.totalSearches)): 0
    const vibes: Record<string, number> = {}
    if (parsed.vibes && typeof parsed.vibes === 'object') {
      for (const [key, value] of Object.entries(parsed.vibes)) {
        if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
          vibes[key] = Math.floor(value)
        }
      }
    }
    return { totalSearches, vibes }
  } catch {
    return emptyState()
  }
}

function writeState(state: AnalyticsState) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true })
  fs.writeFileSync(FILE_PATH, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
}

function parseFormats(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  const unique: string[] = []
  for (const item of input) {
    if (typeof item !== 'string') continue
    const id = item.trim().toLowerCase()
    if (!/^[a-z]{1,32}$/.test(id)) continue
    if (!unique.includes(id)) unique.push(id)
    if (unique.length >= 2) break
  }
  return unique
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

function readBody(req: IncomingMessage, limit = 4096): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > limit) {
        reject(new Error('payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function isAnalyticsPath(req: IncomingMessage) {
  const withOriginal = req as IncomingMessage & { originalUrl?: string }
  const url = withOriginal.originalUrl ?? req.url ?? ''
  return url.split('?')[0] === API_PATH
}

const analyticsMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  if (!isAnalyticsPath(req)) {
    next()
    return
  }

  if (req.method === 'GET') {
    sendJson(res, 200, readState())
    return
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Allow', 'GET, POST')
    res.end()
    return
  }

  void readBody(req)
    .then((raw) => {
      let payload: unknown = {}
      if (raw.trim()) {
        payload = JSON.parse(raw) as unknown
      }
      const formats = parseFormats(
        payload && typeof payload === 'object' && 'formats' in payload
          ? (payload as { formats: unknown }).formats
          : [],
      )
      const nextState = readState()
      nextState.totalSearches += 1
      for (const id of formats) {
        nextState.vibes[id] = (nextState.vibes[id] ?? 0) + 1
      }
      writeState(nextState)
      sendJson(res, 200, nextState)
    })
    .catch(() => {
      sendJson(res, 400, { error: 'invalid payload' })
    })
}

function mount(middlewares: Connect.Server) {
  middlewares.use(analyticsMiddleware)
}

export function searchAnalyticsPlugin(): Plugin {
  return {
    name: 'search-analytics',
    configureServer(server) {
      mount(server.middlewares)
    },
    configurePreviewServer(server) {
      mount(server.middlewares)
    },
  }
}
