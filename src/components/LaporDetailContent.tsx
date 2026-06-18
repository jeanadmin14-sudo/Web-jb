"use client"

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle2, Shield, Calendar, Phone, Hash } from 'lucide-react'

const MOCK_REPORTS: Record<string, any> = {
  '18': {
    id: '18',
    title: 'Nge rip',
    category: 'Pengguna Bermasalah',
    suspect_wa: '6281299248904',
    suspect_id: '-',
    credibility: 'Pelapor Baru',
    created_at: '2026-06-11T10:46:09Z',
    description: 'Dia itu jual akun ff, trus ngerip saya min. Awalnya sepakat 150rb, pas uang udah di-transfer malah di-block WA saya.',
    proofs: ['/Logo.jpeg'],
    status: 'DISETUJUI',
  },
  '17': {
    id: '17',
    title: 'Scam Top Up',
    category: 'ID Game Bermasalah',
    suspect_wa: '6283169896562',
    suspect_id: '82749204',
    credibility: 'Pelapor Terverifikasi',
    created_at: '2026-06-10T16:41:02Z',
    description: 'Transaksi diamond ML di luar grup, uang dikirim diamond tidak masuk. Bukti terlampir.',
    proofs: ['/Logo.jpeg'],
    status: 'DISETUJUI',
  },
  '16': {
    id: '16',
    title: 'Akun Di-hackback',
    category: 'Pengguna Bermasalah',
    suspect_wa: '6285712345678',
    suspect_id: '10294857',
    credibility: 'Pelapor Baru',
    created_at: '2026-06-08T09:20:15Z',
    description: 'Setelah dibeli 3 hari, akun Free Fire di-hackback menggunakan email pemulihan. Bukti chat dan transfer terlampir.',
    proofs: ['/Logo.jpeg'],
    status: 'DISETUJUI',
  },
}

export default function LaporDetailContent() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const report = MOCK_REPORTS[id] || {
    id: id || '?',
    title: 'Laporan Tidak Ditemukan',
    category: 'Unknown',
    suspect_wa: '-',
    suspect_id: '-',
    credibility: '-',
    created_at: new Date().toISOString(),
    description: 'Maaf, data laporan ini tidak ditemukan di database.',
    proofs: [],
    status: 'PROSES',
  }

  const detailBoxStyle = {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(147, 51, 234, 0.15)',
    borderRadius: '16px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.35rem',
  }

  return (
    <section
      className="min-h-screen py-20 relative overflow-hidden"
      style={{ background: '#07010f' }}
    >
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '0', left: '50%',
          transform: 'translateX(-50%)',
          width: '700px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/lapor"
          className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 mb-8 transition-colors hover:text-purple-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke laporan
        </Link>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT CARD (Detail Laporan) ── */}
          <div
            className="lg:col-span-5 p-6 sm:p-8 rounded-3xl"
            style={{
              background: 'rgba(12, 4, 20, 0.6)',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Status */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-green-400 mb-4"
              style={{ background: 'rgba(34, 197, 94, 0.15)' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {report.status}
            </span>

            <h1 className="text-3xl font-black text-white mb-2">
              #{report.id} {report.title}
            </h1>
            <p className="text-sm text-red-400 font-semibold mb-8">{report.category}</p>

            <div className="flex flex-col gap-4">
              {/* Suspect ID */}
              <div style={detailBoxStyle}>
                <span className="text-[10px] font-bold tracking-wider text-white/40 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  ID GAME BERMASALAH
                </span>
                <span className="text-base font-extrabold text-white">{report.suspect_id}</span>
              </div>

              {/* Suspect WA */}
              <div style={detailBoxStyle}>
                <span className="text-[10px] font-bold tracking-wider text-white/40 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  NO WA PELAKU
                </span>
                <span className="text-base font-extrabold text-white">{report.suspect_wa}</span>
              </div>

              {/* Credibility */}
              <div style={detailBoxStyle}>
                <span className="text-[10px] font-bold tracking-wider text-white/40 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  KREDIBILITAS PELAPOR
                </span>
                <span className="text-base font-extrabold text-white">{report.credibility}</span>
              </div>

              {/* Date */}
              <div style={detailBoxStyle}>
                <span className="text-[10px] font-bold tracking-wider text-white/40 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  TANGGAL LAPORAN
                </span>
                <span className="text-base font-extrabold text-white">
                  {new Date(report.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }) + ', ' + new Date(report.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT CARD (Keterangan & Bukti) ── */}
          <div
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl flex flex-col gap-8"
            style={{
              background: 'rgba(12, 4, 20, 0.6)',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Keterangan */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Keterangan</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                {report.description}
              </p>
            </div>

            {/* Foto Bukti */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Foto Bukti</h2>
              {report.proofs && report.proofs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {report.proofs.map((proof: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-square rounded-2xl overflow-hidden relative border border-white/10 group cursor-pointer"
                    >
                      <Image
                        src={proof}
                        alt={`Bukti #${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="p-8 rounded-2xl text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px dashed rgba(147, 51, 234, 0.2)',
                    color: 'rgba(255, 255, 255, 0.35)',
                  }}
                >
                  <p className="text-sm">Tidak ada bukti gambar diunggah.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
