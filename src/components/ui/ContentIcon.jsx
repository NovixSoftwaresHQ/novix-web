import {
  BarChart3, Bell, BookOpen, Bot, Boxes, Brain, Briefcase, Building2, CalendarDays, CheckCircle2, ClipboardList,
  Cloud, Code2, CreditCard, Database, FileText, Gauge, Globe, GraduationCap, HeartPulse, Layers, Mail,
  MapPin, Megaphone, MessageSquare, Network, Palette, Phone, Plug, Receipt, Rocket, Search, Server,
  Settings2, ShieldCheck, ShoppingCart, Smartphone, Truck, Users, Wallet, Workflow,
} from 'lucide-react'

// The content data keeps the live site's icon names; the first matching pattern picks a Lucide icon.
const rules = [
  [/shield|lock|key|fingerprint/, ShieldCheck],
  [/robot/, Bot],
  [/brain|wand|flask|vial/, Brain],
  [/database/, Database],
  [/server/, Server],
  [/cloud/, Cloud],
  [/code|react|docker|keyboard/, Code2],
  [/mobile|android|apple|tablet/, Smartphone],
  [/chart|magnifying-glass-chart|trend|funnel|filter|trophy/, BarChart3],
  [/gauge|bolt|stopwatch|fire/, Gauge],
  [/search|magnifying|eye|viewfinder|bullseye/, Search],
  [/cart|bag|store|barcode|tags|cash-register/, ShoppingCart],
  [/wallet|money|coins|credit-card|dollar|calculator/, Wallet],
  [/credit/, CreditCard],
  [/receipt|invoice/, Receipt],
  [/truck|motorcycle|car|bus|warehouse|road|dolly|flatbed/, Truck],
  [/box/, Boxes],
  [/envelope|inbox/, Mail],
  [/comment|chat|whatsapp/, MessageSquare],
  [/phone|headset|tower|microphone/, Phone],
  [/bell|triangle/, Bell],
  [/calendar|clock/, CalendarDays],
  [/graduation|school|chalkboard/, GraduationCap],
  [/book/, BookOpen],
  [/heart|hospital|doctor|tooth|pill|prescription|bed/, HeartPulse],
  [/location|map|pin/, MapPin],
  [/globe|earth|language|window|display|desktop|laptop/, Globe],
  [/building|industry|house|city/, Building2],
  [/user|people|children|person|id-card|id-badge|address|handshake/, Users],
  [/briefcase|crown|award|certificate|star/, Briefcase],
  [/palette|paint|pen|vector|bezier|shapes|font|compass|feather|crop|camera|video/, Palette],
  [/bullhorn|newspaper|ad|share|meta|linkedin|google/, Megaphone],
  [/sitemap|network|diagram|code-branch|fork|merge/, Network],
  [/arrows|infinity|rotate|spin|exchange/, Workflow],
  [/link|plug|puzzle/, Plug],
  [/gear|slider|screwdriver|wrench|hammer|trowel/, Settings2],
  [/clipboard|list-check|check/, ClipboardList],
  [/file|signature|print|font/, FileText],
  [/layer|cube|table|grid/, Layers],
  [/rocket|play/, Rocket],
]

export default function ContentIcon({ name, className = 'h-5 w-5' }) {
  const Icon = rules.find(([pattern]) => pattern.test(name ?? ''))?.[1] ?? CheckCircle2
  return <Icon aria-hidden="true" className={className} />
}
