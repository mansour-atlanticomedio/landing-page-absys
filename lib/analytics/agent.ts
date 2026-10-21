import type { Browser, Device } from './config'

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bing(preview)?|facebookexternalhit|embedly|quora link|outbrain|pinterest|vkshare|w3c_validator|whatsapp|telegram|discord|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl\/|wget\/|python-requests|python-urllib|go-http-client|java\/|okhttp|axios|node-fetch|undici|postman|insomnia|libwww|httpclient|scrapy|phantomjs|puppeteer|playwright|k6\//i

// Un UA vacío o absurdamente corto no es un navegador real
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.length < 10) return true
  return BOT_PATTERN.test(userAgent)
}

export function detectDevice(userAgent: string): Device {
  if (/ipad|tablet|playbook|silk/i.test(userAgent) || (/android/i.test(userAgent) && !/mobile/i.test(userAgent))) {
    return 'tablet'
  }
  if (/mobi|iphone|ipod|android|windows phone/i.test(userAgent)) return 'mobile'
  if (/windows nt|macintosh|x11|cros|linux/i.test(userAgent)) return 'desktop'
  return 'other'
}

// El orden importa: Edge y Chrome en iOS/Android incluyen "Safari"/"Chrome" en su UA
export function detectBrowser(userAgent: string): Browser {
  if (/edg(e|a|ios)?\//i.test(userAgent)) return 'edge'
  if (/firefox\/|fxios\//i.test(userAgent)) return 'firefox'
  if (/opr\/|opera|samsungbrowser|ucbrowser|vivaldi|brave/i.test(userAgent)) return 'other'
  if (/chrome\/|crios\//i.test(userAgent)) return 'chrome'
  if (/safari\//i.test(userAgent)) return 'safari'
  return 'other'
}
