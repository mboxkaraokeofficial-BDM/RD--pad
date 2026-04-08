import { NextRequest, NextResponse } from 'next/server'

export interface QuoteFormData {
  fullName: string
  phone: string
  email?: string
  company?: string
  serviceType: string
  quantity: string
  budget?: string
  desiredDate?: string
  details?: string
}

async function sendLineNotification(data: QuoteFormData): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const userId = process.env.LINE_NOTIFY_USER_ID

  if (!token || !userId) {
    console.warn('[LINE] Missing LINE_CHANNEL_ACCESS_TOKEN or LINE_NOTIFY_USER_ID')
    return
  }

  const dateStr = data.desiredDate
    ? new Date(data.desiredDate).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-'

  const nowStr = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const message = [
    '📋 คำขอใบเสนอราคาใหม่!',
    '─────────────────────',
    `👤 ชื่อ-นามสกุล : ${data.fullName}`,
    `📞 โทรศัพท์     : ${data.phone}`,
    `📧 อีเมล        : ${data.email || '-'}`,
    `🏢 บริษัท/องค์กร: ${data.company || '-'}`,
    '─────────────────────',
    `📦 สินค้า/บริการ: ${data.serviceType}`,
    `🔢 จำนวน        : ${data.quantity}`,
    `💰 งบประมาณ     : ${data.budget || '-'}`,
    `📅 วันที่ต้องการ : ${dateStr}`,
    '─────────────────────',
    `📝 รายละเอียด   :`,
    data.details || '(ไม่ระบุ)',
    '─────────────────────',
    `⏰ ส่งเมื่อ      : ${nowStr}`,
  ].join('\n')

  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text: message }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[LINE] Push message failed:', res.status, err)
    throw new Error(`LINE API error: ${res.status}`)
  }
}

export async function POST(req: NextRequest) {
  let data: QuoteFormData

  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Basic validation
  if (!data.fullName?.trim()) {
    return NextResponse.json({ error: 'กรุณากรอกชื่อ-นามสกุล' }, { status: 422 })
  }
  if (!data.phone?.trim() || !/^[0-9\-+\s]{9,15}$/.test(data.phone.trim())) {
    return NextResponse.json({ error: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง' }, { status: 422 })
  }
  if (!data.serviceType?.trim()) {
    return NextResponse.json({ error: 'กรุณาเลือกประเภทสินค้า/บริการ' }, { status: 422 })
  }
  if (!data.quantity?.trim()) {
    return NextResponse.json({ error: 'กรุณาระบุจำนวน' }, { status: 422 })
  }

  try {
    await sendLineNotification(data)
  } catch (err) {
    console.error('[Quote API] LINE notification failed:', err)
    // Still return success — form data was received even if notification failed
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
