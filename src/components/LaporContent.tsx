"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldAlert, Search, Plus, X, Upload } from 'lucide-react'

export default function LaporContent() {
  const [reports, setReports] = useState<any[]>([
    {
      id: '18',
      title: 'Nge rip',
      category: 'Pengguna Bermasalah',
      suspect_wa: '6281299248904',
      suspect_id: '-',
      credibility: 'Pelapor Baru',
      created_at: '2026-06-11T10:46:09Z',
      description: 'Dia itu jual akun ff, trus ngerip saya min',
      proofs: ['/Logo.jpeg'],
    },
    {
      id: '17',
      title: 'Scam Top Up',
      category: 'ID Game Bermasalah',
      suspect_wa: '6283169896562',
      suspect_id: '82749204',
      credibility: 'Pelapor Terverifikasi',
      created_at: '2026-06-10T16:41:02Z',
      description: 'Transaksi diamond ML di luar grup, uang dikirim diamond tidak masuk.',
      proofs: [],
    },
    {
      id: '16',
      title: 'Akun Di-hackback',
      category: 'Pengguna Bermasalah',
      suspect_wa: '6285712345678',
      suspect_id: '10294857',
      credibility: 'Pelapor Baru',
      created_at: '2026-06-08T09:20:15Z',
      description: 'Setelah dibeli 3 hari, akun Free Fire di-hackback menggunakan email pemulihan.',
      proofs: [],
    },
  ])

  const [search, setSearch] = useState('')
  const [filteredReports, setFilteredReports] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form states
  const [reporterName, setReporterName] = useState('')
  const [reporterEmail, setReporterEmail] = useState('')
  const [reporterWa, setReporterWa] = useState('')
  const [category, setCategory] = useState('Pengguna Bermasalah')
  const [suspectWa, setSuspectWa] = useState('')
  const [suspectId, setSuspectId] = useState('')
  const [reportTitle, setReportTitle] = useState('')
  const [reportDetail, setReportDetail] = useState('')
  const [images, setImages] = useState<File[]>([])

  useEffect(() => {
    const q = search.trim().toLowerCase()
    if (!q) {
      setFilteredReports(reports)
      return
    }
    const filtered = reports.filter((r) => {
      return (
        r.suspect_wa.includes(q) ||
        r.suspect_id.includes(q) ||
        r.title.toLowerCase().includes(q) ||
        (r.description?.toLowerCase() ?? '').includes(q)
      )
    })
    setFilteredReports(filtered)
  }, [search, reports])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportTitle || !suspectWa) {
      alert('Judul laporan dan nomor WA pelaku wajib diisi.')
      return
    }

    const newReport = {
      id: String(reports.length + 19),
      title: reportTitle,
      category: category,
      suspect_wa: suspectWa,
      suspect_id: suspectId || '-',
      credibility: 'Pelapor Baru',
      created_at: new Date().toISOString(),
      description: reportDetail,
      proofs: images.length > 0 ? ['/Logo.jpeg'] : [],
    }

    setReports([newReport, ...reports])
    setIsModalOpen(false)

    setReporterName('')
    setReporterEmail('')
    setReporterWa('')
    setCategory('Pengguna Bermasalah')
    setSuspectWa('')
    setSuspectId('')
    setReportTitle('')
    setReportDetail('')
    setImages([])

    alert('Laporan Anda berhasil dikirim dan sedang dalam verifikasi admin.')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setImages((prev) => [...prev, ...filesArray].slice(0, 10))
    }
  }

  const inputBase: React.CSSProperties = {
    padding: '12px',
    fontSize: '14px',
    borderRadius: '12px',
    color: '#fff',
    outline: 'none',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(147,51,234,0.15)',
    width: '100%',
  }

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '120px 0 40px',
        position: 'relative',
        overflow: 'hidden',
        background: '#07010f',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '999px',
              padding: '4px 14px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '16px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
            }}
          >
            <ShieldAlert style={{ width: '14px', height: '14px' }} />
            LAPORAN PUBLIK
          </div>
          <h1
            style={{
              fontWeight: 800,
              marginBottom: '12px',
              lineHeight: 1.15,
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            Cari laporan berdasarkan <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #ec4899, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ID game atau nomor WA.
            </span>
          </h1>
          <p style={{ maxWidth: '640px', fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            Daftar ini hanya menampilkan data laporan non-sensitif. Nama, email, dan
            WhatsApp pelapor tetap dilindungi dan hanya bisa dilihat admin.
          </p>
        </div>

        {/* Search Bar Row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                pointerEvents: 'none',
                color: 'rgba(168,85,247,0.5)',
              }}
            />
            <input
              type="text"
              placeholder="Cari ID game atau nomor WA pelaku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                ...inputBase,
                paddingLeft: '40px',
                background: 'rgba(12,4,20,0.8)',
                border: '1px solid rgba(147,51,234,0.2)',
              }}
            />
          </div>
          <button
            onClick={() => setSearch('')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              color: '#fff',
              background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Cari Laporan
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              color: '#fff',
              transition: 'all 0.2s',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(147, 51, 234, 0.35)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(147, 51, 234, 0.12)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)'
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Buat Laporan
          </button>
        </div>

        {/* Results Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Data Bermasalah</h2>
            <p style={{ fontSize: '12px', marginTop: '2px', color: 'rgba(255, 255, 255, 0.45)' }}>
              Ditemukan {filteredReports.length} laporan dari database publik.
            </p>
          </div>
        </div>

        {/* Lapor List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredReports.map((report) => (
            <Link
              key={report.id}
              href={`/lapor/${report.id}`}
              style={{
                padding: '20px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                transition: 'all 0.2s',
                background: 'rgba(12, 4, 20, 0.6)',
                border: '1px solid rgba(147, 51, 234, 0.15)',
                backdropFilter: 'blur(16px)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168, 85, 247, 0.35)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(147, 51, 234, 0.15)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Threat icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SCAM</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      width: 'fit-content',
                      color: '#f87171',
                      background: 'rgba(239, 68, 68, 0.12)',
                    }}
                  >
                    {report.category}
                  </span>
                  <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '16px' }}>
                    #{report.id} {report.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                    No WA Pelaku: <strong style={{ color: '#fff', fontWeight: 600 }}>{report.suspect_wa}</strong>
                  </p>
                </div>
              </div>

              {/* Date */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.35)' }}>
                  {new Date(report.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  }) + ', ' + new Date(report.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </Link>
          ))}

          {filteredReports.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', borderRadius: '16px', background: 'rgba(147,51,234,0.03)', border: '1px solid rgba(147,51,234,0.1)' }}>
              <p style={{ color: '#fff', fontSize: '14px' }}>Tidak ada laporan yang cocok dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup for submitting report */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="modal-box-container"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '32px',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '8px',
                borderRadius: '999px',
                color: 'rgba(255,255,255,0.5)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <div style={{ marginBottom: '24px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#c084fc',
                  background: 'rgba(147, 51, 234, 0.15)',
                }}
              >
                FITUR PELAPOR
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginTop: '8px' }}>Kirim laporan baru.</h2>
              <p style={{ fontSize: '12px', marginTop: '4px', color: 'rgba(255,255,255,0.45)' }}>
                Email dan nomor WhatsApp di bawah adalah data pelapor untuk kebutuhan verifikasi admin. Data ini tidak ditampilkan ke publik.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Reporter Info Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>NAMA (PANGGILAN)</label>
                  <input type="text" required placeholder="Contoh: JBJean" value={reporterName} onChange={(e) => setReporterName(e.target.value)} style={inputBase} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>EMAIL PELAPOR</label>
                  <input type="email" required placeholder="nama@email.com" value={reporterEmail} onChange={(e) => setReporterEmail(e.target.value)} style={inputBase} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>NOMOR WHATSAPP PELAPOR</label>
                <input type="text" required placeholder="628xxxxxxxxxx" value={reporterWa} onChange={(e) => setReporterWa(e.target.value)} style={inputBase} />
              </div>

              {/* Category selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>KATEGORI</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['Pengguna Bermasalah', 'ID Game Bermasalah'].map((cat) => {
                    const isSelected = category === cat
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        style={{
                          padding: '10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          background: isSelected ? 'linear-gradient(135deg, #7c3aed, #9333ea)' : 'rgba(255,255,255,0.03)',
                          border: isSelected ? '1px solid transparent' : '1px solid rgba(147,51,234,0.15)',
                          color: '#fff',
                        }}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>NO WA PELAKU</label>
                <input type="text" required placeholder="628xxxxxxxxxx" value={suspectWa} onChange={(e) => setSuspectWa(e.target.value)} style={inputBase} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>ID GAME PELAKU (OPSIONAL)</label>
                <input type="text" placeholder="Contoh: 12345678" value={suspectId} onChange={(e) => setSuspectId(e.target.value)} style={inputBase} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>JUDUL LAPORAN</label>
                <input type="text" required placeholder="Ringkasan singkat laporan" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} style={inputBase} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>DETAIL LAPORAN</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan kronologi, pihak terkait, nominal jika ada, dan bukti pendukung."
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  style={{ ...inputBase, resize: 'none' }}
                />
              </div>

              {/* File Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>BUKTI UPLOAD IMAGE (1-10 GAMBAR)</label>
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1.5px dashed rgba(147,51,234,0.2)',
                  }}
                >
                  <Upload style={{ width: '24px', height: '24px', color: '#a855f7' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Pilih screenshot atau foto bukti</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Maksimal 10 gambar, tiap gambar maksimal 4MB</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  />
                </div>
                {images.length > 0 && (
                  <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600, marginTop: '4px' }}>
                    {images.length} foto terpilih untuk diunggah.
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Kirim Laporan
              </button>

              <p style={{ fontSize: '9px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginTop: '8px' }}>
                Email dan WhatsApp pelapor hanya digunakan untuk verifikasi, permintaan bukti tambahan, dan update status laporan. Kami tidak membagikan data Anda kepada publik atau terlapor.
              </p>
            </form>
          </div>
        </div>
      )}
      {/* Responsive */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding-top: 88px !important;
            padding-bottom: 24px !important;
          }
        }
      `}</style>
    </section>
  )
}
