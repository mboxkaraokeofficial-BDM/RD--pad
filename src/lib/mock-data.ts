import { Song, Room, Playlist, Effect, User } from './types'

export const MOCK_SONGS: Song[] = [
  { id: 'TH001', title: 'มนต์รักลูกทุ่ง', artist: 'ไมค์ ภิรมย์พร', category: 'ลูกทุ่ง', duration: 245, language: 'TH' },
  { id: 'TH002', title: 'ขอโทษ', artist: 'พงษ์สิทธิ์ คำภีร์', category: 'ลูกทุ่ง', duration: 218, language: 'TH' },
  { id: 'TH003', title: 'คืนเดือนหงาย', artist: 'ยิ่งยง ยอดบัวงาม', category: 'ลูกทุ่ง', duration: 232, language: 'TH' },
  { id: 'TH004', title: 'เพลงรัก', artist: 'บอดี้สแลม', category: 'สตริง', duration: 198, language: 'TH' },
  { id: 'TH005', title: 'ทางของเธอ', artist: 'Potato', category: 'สตริง', duration: 214, language: 'TH' },
  { id: 'TH006', title: 'ไม่ใช่คนของกัน', artist: 'Slot Machine', category: 'สตริง', duration: 225, language: 'TH' },
  { id: 'TH007', title: 'ใจสั่งมา', artist: 'KPN', category: 'สตริง', duration: 201, language: 'TH' },
  { id: 'TH008', title: 'รักเธอทุกวัน', artist: 'Musketeers', category: 'สตริง', duration: 187, language: 'TH' },
  { id: 'TH009', title: 'หัวใจขาดดุล', artist: 'Modern Dog', category: 'สตริง', duration: 210, language: 'TH' },
  { id: 'TH010', title: 'อยู่ตรงนี้นานกว่านี้', artist: 'Palmy', category: 'เพลงช้า', duration: 265, language: 'TH' },
  { id: 'TH011', title: 'สายฝน', artist: 'เบิร์ด ธงไชย', category: 'ลูกกรุง', duration: 234, language: 'TH' },
  { id: 'TH012', title: 'แฟนเก่า', artist: 'เก่า วราวุธ', category: 'ลูกทุ่ง', duration: 256, language: 'TH', isNew: true },
  { id: 'TH013', title: 'น้ำตาแสงไต้', artist: 'ต่าย อรทัย', category: 'ลูกทุ่ง', duration: 229, language: 'TH' },
  { id: 'TH014', title: 'คิดถึงเธอทุกวัน', artist: 'Mild', category: 'เพลงช้า', duration: 243, language: 'TH', isNew: true },
  { id: 'EN001', title: 'Shape of You', artist: 'Ed Sheeran', category: 'สากล', duration: 233, language: 'EN' },
  { id: 'EN002', title: 'Blinding Lights', artist: 'The Weeknd', category: 'สากล', duration: 200, language: 'EN' },
  { id: 'EN003', title: 'Perfect', artist: 'Ed Sheeran', category: 'สากล', duration: 263, language: 'EN' },
  { id: 'EN004', title: 'Stay With Me', artist: 'Sam Smith', category: 'สากล', duration: 172, language: 'EN' },
  { id: 'EN005', title: 'Someone Like You', artist: 'Adele', category: 'สากล', duration: 285, language: 'EN' },
  { id: 'JP001', title: 'Lemon', artist: 'Kenshi Yonezu', category: 'ญี่ปุ่น', duration: 268, language: 'JP' },
  { id: 'JP002', title: 'Pretender', artist: 'Official HIGE DANdism', category: 'ญี่ปุ่น', duration: 271, language: 'JP' },
  { id: 'KR001', title: 'Dynamite', artist: 'BTS', category: 'เกาหลี', duration: 199, language: 'KR', isNew: true },
  { id: 'KR002', title: 'Butter', artist: 'BTS', category: 'เกาหลี', duration: 164, language: 'KR' },
]

export const MOCK_ROOMS: Room[] = [
  { id: 'room-1', name: 'ห้อง 1', mboxIp: '192.168.1.101', mboxPort: 6666, status: 'connected', sessionActive: true, currentSong: MOCK_SONGS[0] },
  { id: 'room-2', name: 'ห้อง 2', mboxIp: '192.168.1.102', mboxPort: 6666, status: 'connected', sessionActive: true, currentSong: MOCK_SONGS[4] },
  { id: 'room-3', name: 'ห้อง 3', mboxIp: '192.168.1.103', mboxPort: 6666, status: 'disconnected', sessionActive: false },
  { id: 'room-4', name: 'ห้อง 4', mboxIp: '192.168.1.104', mboxPort: 6666, status: 'offline', sessionActive: false },
  { id: 'room-5', name: 'ห้อง VIP', mboxIp: '192.168.1.105', mboxPort: 6666, status: 'connected', sessionActive: true, currentSong: MOCK_SONGS[14] },
]

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: 'pl-1', name: 'เพลงโปรด', songs: [MOCK_SONGS[0], MOCK_SONGS[1], MOCK_SONGS[10], MOCK_SONGS[11]], createdAt: new Date('2024-01-15') },
  { id: 'pl-2', name: 'ลูกทุ่งชอบ', songs: [MOCK_SONGS[0], MOCK_SONGS[2], MOCK_SONGS[12]], createdAt: new Date('2024-02-10') },
  { id: 'pl-3', name: 'เพลงช้า', songs: [MOCK_SONGS[9], MOCK_SONGS[13], MOCK_SONGS[16]], createdAt: new Date('2024-03-05') },
]

export const MOCK_EFFECTS: Effect[] = [
  { id: 'clap',     label: 'ตบมือ',   emoji: '👏', color: '#F59E0B' },
  { id: 'laugh',    label: 'หัวเราะ', emoji: '😂', color: '#10B981' },
  { id: 'drum',     label: 'กลอง',    emoji: '🥁', color: '#EF4444' },
  { id: 'party',    label: 'ปาร์ตี้', emoji: '🎉', color: '#8B5CF6' },
  { id: 'horn',     label: 'แตร',     emoji: '📯', color: '#F97316' },
  { id: 'scream',   label: 'ตกใจ',    emoji: '😱', color: '#EC4899' },
  { id: 'sad',      label: 'เสียใจ',  emoji: '😢', color: '#6B7280' },
  { id: 'bell',     label: 'กระดิ่ง', emoji: '🔔', color: '#EAB308' },
  { id: 'wow',      label: 'ว้าว',    emoji: '🤩', color: '#06B6D4' },
  { id: 'fire',     label: 'ไฟ',      emoji: '🔥', color: '#DC2626' },
  { id: 'kiss',     label: 'จูบ',     emoji: '💋', color: '#F43F5E' },
  { id: 'music',    label: 'เพลง',    emoji: '🎵', color: '#7C3AED' },
]

export const MOCK_USER: User = {
  id: 'user-1',
  displayName: 'สมชาย ใจดี',
  provider: 'line',
}

export const SONG_CATEGORIES = [
  'ทั้งหมด', 'ลูกทุ่ง', 'สตริง', 'สากล', 'เพลงใหม่', 'ฮิต', 'ลูกกรุง', 'เพลงช้า', 'ญี่ปุ่น', 'เกาหลี',
]

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
