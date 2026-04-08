'use client'
import { useState, FormEvent } from 'react'
import {
  User, Phone, Mail, Building2, Package, Hash,
  Wallet, CalendarDays, FileText, Send, CheckCircle2,
  AlertCircle, ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const SERVICE_OPTIONS = [
  'เช่าเครื่องคาราโอเกะ MBOX',
  'ซื้อเครื่องคาราโอเกะ MBOX',
  'ระบบคาราโอเกะสำหรับร้านอาหาร / บาร์',
  'ระบบคาราโอเกะสำหรับโรงแรม / รีสอร์ต',
  'บริการซ่อมบำรุง / อัปเกรด',
  'แพ็กเกจพิเศษ (ระบุในรายละเอียด)',
  'อื่นๆ',
]

interface FormState {
  fullName: string
  phone: string
  email: string
  company: string
  serviceType: string
  quantity: string
  budget: string
  desiredDate: string
  details: string
}

const INIT: FormState = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  serviceType: '',
  quantity: '',
  budget: '',
  desiredDate: '',
  details: '',
}

type Status = 'idle' | 'loading' | 'success' | 'error'

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string
  icon: React.ElementType
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
        <Icon size={14} className="text-accent-purple shrink-0" />
        {label}
        {required && <span className="text-accent-pink text-xs">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = cn(
  'w-full rounded-2xl px-4 py-3 text-sm text-text-primary',
  'bg-white/[0.06] border border-white/10',
  'placeholder:text-text-muted',
  'focus:outline-none focus:border-accent-purple/60 focus:bg-white/[0.09]',
  'transition-all duration-200',
)

export default function QuotePage() {
  const [form, setForm] = useState<FormState>(INIT)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const json = await res.json()

      if (!res.ok) {
        setErrorMsg(json.error ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMsg('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่')
      setStatus('error')
    }
  }

  // ─── Success screen ──────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-status-online/20 flex items-center justify-center shadow-[0_0_32px_rgba(16,185,129,0.35)]">
          <CheckCircle2 size={40} className="text-status-online" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">ส่งคำขอสำเร็จ!</h2>
          <p className="text-text-secondary leading-relaxed">
            ทีมงานได้รับข้อมูลของคุณแล้ว<br />
            เราจะติดต่อกลับโดยเร็วที่สุด
          </p>
        </div>
        <button
          onClick={() => { setForm(INIT); setStatus('idle') }}
          className="btn-pill-primary mt-2"
        >
          ส่งคำขอใหม่
        </button>
      </div>
    )
  }

  // ─── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-nav px-4 py-4 flex items-center gap-3 mb-2">
        <Link
          href="/"
          className="icon-btn w-9 h-9 text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={22} />
        </Link>
        <div>
          <h1 className="text-base font-bold leading-tight">ขอใบเสนอราคา</h1>
          <p className="text-xs text-text-muted leading-tight">MBOX Karaoke System</p>
        </div>
        {/* LINE badge */}
        <div className="ml-auto flex items-center gap-1.5 bg-[#06C755]/15 border border-[#06C755]/30 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-[#06C755] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#06C755]">LINE แจ้งเตือน</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-5 mt-4">
        {/* Section: ข้อมูลติดต่อ */}
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">
            ข้อมูลติดต่อ
          </p>

          <Field label="ชื่อ-นามสกุล" icon={User} required>
            <input
              type="text"
              className={inputCls}
              placeholder="กรอกชื่อ-นามสกุล"
              value={form.fullName}
              onChange={set('fullName')}
              required
            />
          </Field>

          <Field label="เบอร์โทรศัพท์" icon={Phone} required>
            <input
              type="tel"
              inputMode="tel"
              className={inputCls}
              placeholder="0xx-xxx-xxxx"
              value={form.phone}
              onChange={set('phone')}
              required
            />
          </Field>

          <Field label="อีเมล" icon={Mail}>
            <input
              type="email"
              inputMode="email"
              className={inputCls}
              placeholder="example@email.com"
              value={form.email}
              onChange={set('email')}
            />
          </Field>

          <Field label="ชื่อบริษัท / องค์กร" icon={Building2}>
            <input
              type="text"
              className={inputCls}
              placeholder="ระบุชื่อบริษัทหรือองค์กร (ถ้ามี)"
              value={form.company}
              onChange={set('company')}
            />
          </Field>
        </div>

        {/* Section: รายละเอียดการสั่งซื้อ */}
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">
            รายละเอียดคำขอ
          </p>

          <Field label="ประเภทสินค้า / บริการ" icon={Package} required>
            <select
              className={cn(inputCls, 'appearance-none cursor-pointer')}
              value={form.serviceType}
              onChange={set('serviceType')}
              required
            >
              <option value="" disabled>-- เลือกประเภทสินค้า/บริการ --</option>
              {SERVICE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </Field>

          <Field label="จำนวน" icon={Hash} required>
            <input
              type="text"
              inputMode="numeric"
              className={inputCls}
              placeholder="เช่น 1 ชุด, 3 เครื่อง"
              value={form.quantity}
              onChange={set('quantity')}
              required
            />
          </Field>

          <Field label="งบประมาณโดยประมาณ" icon={Wallet}>
            <input
              type="text"
              className={inputCls}
              placeholder="เช่น 50,000 บาท"
              value={form.budget}
              onChange={set('budget')}
            />
          </Field>

          <Field label="วันที่ต้องการ" icon={CalendarDays}>
            <input
              type="date"
              className={cn(inputCls, 'color-scheme-dark')}
              value={form.desiredDate}
              onChange={set('desiredDate')}
              min={new Date().toISOString().split('T')[0]}
            />
          </Field>

          <Field label="รายละเอียดเพิ่มเติม" icon={FileText}>
            <textarea
              className={cn(inputCls, 'resize-none min-h-[96px]')}
              placeholder="ระบุความต้องการเพิ่มเติม เช่น สถานที่ติดตั้ง รุ่นที่สนใจ ฯลฯ"
              value={form.details}
              onChange={set('details')}
              rows={4}
            />
          </Field>
        </div>

        {/* Error banner */}
        {status === 'error' && (
          <div className="flex items-center gap-3 rounded-2xl bg-status-offline/15 border border-status-offline/30 px-4 py-3 animate-fade-in">
            <AlertCircle size={18} className="text-status-offline shrink-0" />
            <p className="text-sm text-status-offline">{errorMsg}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'w-full rounded-2xl py-4 font-semibold text-base transition-all duration-200',
            'flex items-center justify-center gap-2.5',
            status === 'loading'
              ? 'bg-accent-purple/40 text-white/60 cursor-not-allowed'
              : 'bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-glow-md active:scale-[0.98]',
          )}
        >
          {status === 'loading' ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              กำลังส่ง...
            </>
          ) : (
            <>
              <Send size={18} />
              ส่งคำขอใบเสนอราคา
            </>
          )}
        </button>

        <p className="text-center text-xs text-text-muted pb-2">
          เมื่อส่งแบบฟอร์ม ทีมงานจะได้รับแจ้งเตือนผ่าน LINE ทันที
        </p>
      </form>
    </div>
  )
}
