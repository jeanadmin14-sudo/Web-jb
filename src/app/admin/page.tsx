"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Edit2, Trash2, LogOut, Package, Users, Shield, History, Link2 } from 'lucide-react'
import {
  getProducts,
  saveProduct,
  deleteProduct,
  getPartners,
  savePartner,
  deletePartner,
  getAdmins,
  saveAdmin,
  deleteAdmin,
  getActivityLogs,
  getBlockedIps,
  suspendIp,
  unsuspendIp,
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  AdminAccount,
  ActivityLog,
  BlockedIp,
  SiteSettings
} from '@/lib/storage'
import type { Product, Partner } from '@/lib/supabase'
import { uploadImageFile } from '@/lib/media-upload'

type AdminTab = 'products' | 'partners' | 'admins' | 'logs' | 'settings'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function getRiskStyle(level: string | null | undefined) {
  if (level === 'High') {
    return {
      background: 'rgba(239, 68, 68, 0.14)',
      border: '1px solid rgba(239, 68, 68, 0.35)',
      color: '#f87171',
    }
  }

  if (level === 'Medium') {
    return {
      background: 'rgba(234, 179, 8, 0.14)',
      border: '1px solid rgba(234, 179, 8, 0.35)',
      color: '#facc15',
    }
  }

  return {
    background: 'rgba(34, 197, 94, 0.12)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    color: '#86efac',
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [sessionUser, setSessionUser] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<AdminTab>('products')
  
  // Data lists
  const [products, setProducts] = useState<Product[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [admins, setAdmins] = useState<AdminAccount[]>([])
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([])

  // Pagination states
  const [prodPage, setProdPage] = useState(1)
  const [partPage, setPartPage] = useState(1)
  const [logsPage, setLogsPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  const totalProdPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const paginatedProducts = products.slice((prodPage - 1) * ITEMS_PER_PAGE, prodPage * ITEMS_PER_PAGE)

  const totalPartPages = Math.ceil(partners.length / ITEMS_PER_PAGE)
  const paginatedPartners = partners.slice((partPage - 1) * ITEMS_PER_PAGE, partPage * ITEMS_PER_PAGE)

  const totalLogPages = Math.ceil(logs.length / ITEMS_PER_PAGE)
  const paginatedLogs = logs.slice((logsPage - 1) * ITEMS_PER_PAGE, logsPage * ITEMS_PER_PAGE)

  // Modal / Form States - Products
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [prodName, setProdName] = useState('')
  const [prodDesc, setProdDesc] = useState('')
  const [prodPrice, setProdPrice] = useState(0)
  const [prodCategory, setProdCategory] = useState('Free Fire')
  const [prodStatus, setProdStatus] = useState('Ready')
  const [prodImage, setProdImage] = useState('/Logo.jpeg')
  const [prodRentEnd, setProdRentEnd] = useState('')
  const [prodGallery, setProdGallery] = useState<string[]>([])
  const [prodPackages, setProdPackages] = useState<{name: string, price: number}[]>([])
  const [newPkgName, setNewPkgName] = useState('')
  const [newPkgPrice, setNewPkgPrice] = useState(0)

  // Drag and Drop active states
  const [prodDragActive, setProdDragActive] = useState(false)
  const [partDragActive, setPartDragActive] = useState(false)
  const [uploadingProdImage, setUploadingProdImage] = useState(false)
  const [uploadingPartImage, setUploadingPartImage] = useState(false)

  const handleProductFile = async (file: File | undefined) => {
    if (!file) return
    setUploadingProdImage(true)
    try {
      setProdImage(await uploadImageFile(file, { folder: 'products', maxSize: 1600, quality: 0.82 }))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal upload gambar produk.')
    } finally {
      setUploadingProdImage(false)
    }
  }

  const handlePartnerFile = async (file: File | undefined) => {
    if (!file) return
    setUploadingPartImage(true)
    try {
      setPartImage(await uploadImageFile(file, { folder: 'partners', maxSize: 1600, quality: 0.82 }))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal upload gambar partner.')
    } finally {
      setUploadingPartImage(false)
    }
  }

  // Modal / Form States - Partners
  const [showPartnerModal, setShowPartnerModal] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [partName, setPartName] = useState('')
  const [partDesc, setPartDesc] = useState('')
  const [partWaUrl, setPartWaUrl] = useState('')
  const [partWaNumber, setPartWaNumber] = useState('')
  const [partImage, setPartImage] = useState('/Logo.jpeg')
  const [partStatus, setPartStatus] = useState('Ready')
  const [partCategory, setPartCategory] = useState('Partner Resmi')

  // State for beautiful custom confirm delete modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'product' | 'partner' | 'admin'
    id: string
    name: string
  } | null>(null)

  // Modal / Form States - Admins
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [newAdminUser, setNewAdminUser] = useState('')
  const [newAdminPass, setNewAdminPass] = useState('')
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null)

  // Contact & social settings
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [savingSettings, setSavingSettings] = useState(false)

  const loadAllData = useCallback(async () => {
    const p = await getProducts()
    const pt = await getPartners()
    const a = await getAdmins()
    const l = await getActivityLogs()
    const b = await getBlockedIps()
    const s = await getSettings()
    setProducts(p)
    setPartners(pt)
    setAdmins(a)
    setLogs(l)
    setBlockedIps(b)
    setSettingsForm(s)
  }, [])

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    const ok = await saveSettings(settingsForm)
    setSavingSettings(false)
    if (ok) {
      alert('Kontak & sosmed berhasil disimpan.')
    } else {
      alert('Gagal menyimpan. Cek sesi admin atau koneksi database.')
    }
  }

  const isIpSuspended = useCallback((ipAddress: string | null | undefined) => {
    return blockedIps.some((item) => item.ip_address === ipAddress)
  }, [blockedIps])

  const handleSuspendIp = async (ipAddress: string | null | undefined, action: string) => {
    if (!ipAddress || ipAddress === 'Tidak tersedia' || ipAddress === 'Tidak diketahui' || ipAddress === 'LocalStorage') {
      alert('IP tidak valid untuk disuspend.')
      return
    }

    const ok = window.confirm(`Suspend IP ${ipAddress}? IP ini tidak bisa login atau mengakses API admin lagi.`)
    if (!ok) return

    const saved = await suspendIp(ipAddress, `Suspended dari log: ${action.slice(0, 180)}`)
    if (saved) {
      await loadAllData()
    } else {
      alert('Gagal suspend IP. Cek sesi admin atau koneksi database.')
    }
  }

  const handleUnsuspendIp = async (ipAddress: string) => {
    const ok = window.confirm(`Buka suspend IP ${ipAddress}?`)
    if (!ok) return

    const saved = await unsuspendIp(ipAddress)
    if (saved) {
      await loadAllData()
    } else {
      alert('Gagal membuka suspend IP.')
    }
  }

  // Auth checking
  useEffect(() => {
    const session = localStorage.getItem('jbjean_session')
    if (!session) {
      router.push('/login')
      return
    }

    window.setTimeout(() => {
      setSessionUser(session)
      void loadAllData()
    }, 0)
  }, [loadAllData, router])

  const handleLogout = () => {
    localStorage.removeItem('jbjean_session')
    router.push('/login')
  }

  // --- Products CRUD Actions ---
  const openAddProduct = () => {
    setEditingProduct(null)
    setProdName('')
    setProdDesc('')
    setProdPrice(0)
    setProdCategory('Free Fire')
    setProdStatus('Ready')
    setProdImage('/Logo.jpeg')
    setProdRentEnd('')
    setProdGallery([])
    setProdPackages([])
    setNewPkgName('')
    setNewPkgPrice(0)
    setShowProductModal(true)
  }

  const openEditProduct = (p: Product) => {
    setEditingProduct(p)
    setProdName(p.name)
    setProdDesc(p.description || '')
    setProdPrice(p.price)
    setProdCategory(p.category)
    setProdStatus(p.status)
    setProdImage(p.image_url || '/Logo.jpeg')
    setProdRentEnd(p.rent_end_date || '')
    try {
      setProdGallery(p.gallery ? JSON.parse(p.gallery) : [])
    } catch {
      setProdGallery([])
    }
    try {
      setProdPackages(p.rental_packages ? JSON.parse(p.rental_packages) : [])
    } catch {
      setProdPackages([])
    }
    setNewPkgName('')
    setNewPkgPrice(0)
    setShowProductModal(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const newProd: Product = {
      id: editingProduct ? editingProduct.id : 'p_' + Date.now(),
      name: prodName,
      description: prodDesc,
      price: Number(prodPrice),
      category: prodCategory,
      status: prodStatus,
      image_url: prodImage || '/Logo.jpeg',
      gallery: JSON.stringify(prodGallery),
      rental_packages: JSON.stringify(prodPackages),
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString(),
      rent_end_date: prodCategory === 'Rental' && prodRentEnd ? prodRentEnd : null
    }
    await saveProduct(newProd)
    setShowProductModal(false)
    loadAllData()
  }

  const handleDeleteProduct = (p: Product) => {
    setDeleteConfirm({
      type: 'product',
      id: p.id,
      name: p.name
    })
  }

  const handleDeletePartner = (pt: Partner) => {
    setDeleteConfirm({
      type: 'partner',
      id: pt.id,
      name: pt.name
    })
  }

  const handleDeleteAdmin = (username: string) => {
    if (username === sessionUser) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.')
      return
    }
    if (admins.length <= 1) {
      alert('Harus ada minimal 1 akun admin di sistem.')
      return
    }
    setDeleteConfirm({
      type: 'admin',
      id: username,
      name: username
    })
  }

  const executeDelete = async () => {
    if (!deleteConfirm) return
    const { type, id } = deleteConfirm
    if (type === 'product') {
      await deleteProduct(id)
    } else if (type === 'partner') {
      await deletePartner(id)
    } else if (type === 'admin') {
      await deleteAdmin(id)
    }
    setDeleteConfirm(null)
    loadAllData()
  }

  const toggleProductSoldOut = async (p: Product) => {
    const updated: Product = {
      ...p,
      status: p.status === 'Sold Out' ? 'Ready' : 'Sold Out'
    }
    await saveProduct(updated)
    loadAllData()
  }

  // --- Partners CRUD Actions ---
  const openAddPartner = () => {
    setEditingPartner(null)
    setPartName('')
    setPartDesc('')
    setPartWaUrl('')
    setPartWaNumber('')
    setPartImage('/Logo.jpeg')
    setPartStatus('Ready')
    setPartCategory('Partner Resmi')
    setShowPartnerModal(true)
  }

  const openEditPartner = (pt: Partner) => {
    setEditingPartner(pt)
    setPartName(pt.name)
    setPartDesc(pt.description || '')
    setPartWaUrl(pt.wa_channel_url || '')
    setPartWaNumber(pt.whatsapp_number || '')
    setPartImage(pt.image_url || '/Logo.jpeg')
    setPartStatus(pt.status || 'Ready')
    setPartCategory(pt.category || 'Partner Resmi')
    setShowPartnerModal(true)
  }

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    const newPart: Partner = {
      id: editingPartner ? editingPartner.id : 'partner_' + Date.now(),
      name: partName,
      description: partDesc,
      wa_channel_url: partWaUrl,
      whatsapp_number: partWaNumber || null,
      image_url: partImage || '/Logo.jpeg',
      status: partStatus,
      category: partCategory,
      created_at: editingPartner ? editingPartner.created_at : new Date().toISOString()
    }
    await savePartner(newPart)
    setShowPartnerModal(false)
    loadAllData()
  }

  // --- Admin CRUD Actions ---
  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminUser.trim() || !newAdminPass) return
    const newAdmin: AdminAccount = {
      username: newAdminUser.trim(),
      passwordHash: newAdminPass
    }
    await saveAdmin(newAdmin)
    setNewAdminUser('')
    setNewAdminPass('')
    setEditingAdmin(null)
    setShowAdminModal(false)
    loadAllData()
  }

  if (!sessionUser) return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Memuat Halaman...</div>

  return (
    <div
      className="admin-page"
      style={{
        minHeight: '100vh',
        background: '#07010f',
        color: '#fff',
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(147,51,234,0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="admin-container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px 80px 24px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Dashboard Header */}
        <div
          className="admin-dashboard-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(15, 6, 32, 0.75)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '20px',
            padding: '16px 24px',
            backdropFilter: 'blur(20px)',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image
              src="/Logo.jpeg"
              alt="Logo"
              width={36}
              height={36}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>
                JB<span style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Jean</span> Dashboard
              </h1>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>Login sebagai: {sessionUser}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
          >
            <LogOut style={{ width: '14px', height: '14px' }} />
            Keluar
          </button>
        </div>

        {/* Tab Controls */}
        <div
          className="admin-tabs"
          style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(12, 4, 20, 0.8)',
            border: '1px solid rgba(147, 51, 234, 0.18)',
            borderRadius: '999px',
            padding: '4px',
            marginBottom: '32px',
            width: 'fit-content',
          }}
        >
          {([
            { id: 'products', label: 'Kelola Produk', icon: Package },
            { id: 'partners', label: 'Kelola Layanan', icon: Users },
            { id: 'settings', label: 'Kontak & Sosmed', icon: Link2 },
            { id: 'admins', label: 'Akun Admin', icon: Shield },
            { id: 'logs', label: 'Log Aktivitas', icon: History },
          ] satisfies Array<{ id: AdminTab; label: string; icon: typeof Package }>).map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s',
                  ...(isActive
                    ? { background: 'linear-gradient(135deg, #ec4899, #a855f7)', color: '#fff', boxShadow: '0 0 12px rgba(236,72,153,0.3)' }
                    : { background: 'transparent', color: 'rgba(255,255,255,0.6)' }),
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Daftar Produk</h2>
              <button
                onClick={openAddProduct}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)',
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Tambah Produk
              </button>
            </div>

            {/* Products Table */}
            <div style={{ overflowX: 'auto', background: 'rgba(12, 4, 20, 0.65)', border: '1px solid rgba(147, 51, 234, 0.15)', borderRadius: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(147, 51, 234, 0.15)', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Produk</th>
                    <th style={{ padding: '16px' }}>Kategori</th>
                    <th style={{ padding: '16px' }}>Harga</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Masa Sewa</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(147, 51, 234, 0.08)' }}>
                      <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                          <Image src={p.image_url || '/Logo.jpeg'} alt={p.name} fill style={{ objectFit: 'cover' }} unoptimized />
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: '#fff' }}>{p.name}</strong>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ fontSize: '12px', background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236,72,153,0.3)', color: '#f472b6', padding: '3px 8px', borderRadius: '999px' }}>{p.category}</span>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 700, color: '#c084fc' }}>{formatRupiah(p.price)}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          fontSize: '12px',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: p.status === 'Ready' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: p.status === 'Ready' ? '#4ade80' : '#f87171',
                          border: `1px solid ${p.status === 'Ready' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                        }}>{p.status}</span>
                      </td>
                      <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>
                        {p.category === 'Rental' && p.rent_end_date ? (
                          <span style={{ fontSize: '13px', background: 'rgba(147, 51, 234, 0.15)', color: '#c084fc', padding: '3px 8px', borderRadius: '6px' }}>
                            s/d {p.rent_end_date}
                          </span>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => toggleProductSoldOut(p)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: p.status === 'Sold Out' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.3)',
                              background: p.status === 'Sold Out' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                              color: p.status === 'Sold Out' ? '#4ade80' : '#f87171',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {p.status === 'Sold Out' ? 'Ready Kan' : 'Set Sold Out'}
                          </button>
                          <button
                            onClick={() => openEditProduct(p)}
                            style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}
                            title="Edit"
                          >
                            <Edit2 style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer' }}
                            title="Hapus"
                          >
                            <Trash2 style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>Tidak ada produk.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalProdPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                <button
                  disabled={prodPage === 1}
                  onClick={() => setProdPage(prev => Math.max(prev - 1, 1))}
                  style={pageBtnStyle(prodPage === 1)}
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalProdPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setProdPage(idx + 1)}
                    style={pageNumStyle(prodPage === idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={prodPage === totalProdPages}
                  onClick={() => setProdPage(prev => Math.min(prev + 1, totalProdPages))}
                  style={pageBtnStyle(prodPage === totalProdPages)}
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- PARTNERS TAB --- */}
        {activeTab === 'partners' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Daftar Layanan Partner</h2>
              <button
                onClick={openAddPartner}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)',
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Tambah Partner
              </button>
            </div>

            {/* Partners Table */}
            <div style={{ overflowX: 'auto', background: 'rgba(12, 4, 20, 0.65)', border: '1px solid rgba(147, 51, 234, 0.15)', borderRadius: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(147, 51, 234, 0.15)', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Partner</th>
                    <th style={{ padding: '16px' }}>WhatsApp Channel & Chat</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPartners.map((pt) => (
                    <tr key={pt.id} style={{ borderBottom: '1px solid rgba(147, 51, 234, 0.08)' }}>
                      <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                          <Image src={pt.image_url || '/Logo.jpeg'} alt={pt.name} fill style={{ objectFit: 'cover' }} unoptimized />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ display: 'block', color: '#fff' }}>{pt.name}</strong>
                            {pt.category === 'Blacklist' && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: '999px',
                                background: 'rgba(239,68,68,0.14)',
                                color: '#f87171',
                                border: '1px solid rgba(239,68,68,0.35)',
                              }}>
                                BLACKLIST
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{pt.description}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {pt.wa_channel_url && (
                            <a href={pt.wa_channel_url} target="_blank" rel="noopener noreferrer" style={{ color: '#c084fc', textDecoration: 'underline', fontSize: '13px' }}>
                              Channel WA
                            </a>
                          )}
                          {pt.whatsapp_number ? (
                            <a href={`https://wa.me/${pt.whatsapp_number}`} target="_blank" rel="noopener noreferrer" style={{ color: '#f472b6', textDecoration: 'underline', fontSize: '13px' }}>
                              WhatsApp Chat (+{pt.whatsapp_number})
                            </a>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>No WA Chat</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          fontSize: '12px',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: pt.status === 'Ready' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: pt.status === 'Ready' ? '#4ade80' : '#f87171',
                          border: `1px solid ${pt.status === 'Ready' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                        }}>{pt.status || 'Ready'}</span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => openEditPartner(pt)}
                            style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}
                            title="Edit"
                          >
                            <Edit2 style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button
                            onClick={() => handleDeletePartner(pt)}
                            style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer' }}
                            title="Hapus"
                          >
                            <Trash2 style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {partners.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>Tidak ada partner.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPartPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                <button
                  disabled={partPage === 1}
                  onClick={() => setPartPage(prev => Math.max(prev - 1, 1))}
                  style={pageBtnStyle(partPage === 1)}
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalPartPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPartPage(idx + 1)}
                    style={pageNumStyle(partPage === idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={partPage === totalPartPages}
                  onClick={() => setPartPage(prev => Math.min(prev + 1, totalPartPages))}
                  style={pageBtnStyle(partPage === totalPartPages)}
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- ADMINS TAB --- */}
        {activeTab === 'admins' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Daftar Akun Admin</h2>
              <button
                onClick={() => {
                  setEditingAdmin(null)
                  setNewAdminUser('')
                  setNewAdminPass('')
                  setShowAdminModal(true)
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)',
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Tambah Admin
              </button>
            </div>

            {/* Admin Table */}
            <div style={{ overflowX: 'auto', background: 'rgba(12, 4, 20, 0.65)', border: '1px solid rgba(147, 51, 234, 0.15)', borderRadius: '20px', maxWidth: '600px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(147, 51, 234, 0.15)', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Username</th>
                    <th style={{ padding: '16px' }}>Password</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr key={a.username} style={{ borderBottom: '1px solid rgba(147, 51, 234, 0.08)' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{a.username}</td>
                      <td style={{ padding: '16px', color: 'rgba(255,255,255,0.45)' }}>••••••••</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => {
                              setEditingAdmin(a)
                              setNewAdminUser(a.username)
                              setNewAdminPass(a.passwordHash)
                              setShowAdminModal(true)
                            }}
                            style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}
                            title="Ubah Password"
                          >
                            <Edit2 style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(a.username)}
                            disabled={a.username === sessionUser}
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                              border: 'none',
                              background: a.username === sessionUser ? 'rgba(255,255,255,0.02)' : 'rgba(239,68,68,0.1)',
                              color: a.username === sessionUser ? 'rgba(255,255,255,0.2)' : '#f87171',
                              cursor: a.username === sessionUser ? 'not-allowed' : 'pointer',
                            }}
                          >
                            <Trash2 style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- LOGS TAB --- */}
        {activeTab === 'logs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Log Aktivitas Admin</h2>
                <p style={{ marginTop: '6px', color: 'rgba(255,255,255,0.42)', fontSize: '13px' }}>
                  IP suspended aktif: {blockedIps.length}
                </p>
              </div>
              <button
                onClick={async () => {
                  await loadAllData()
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              >
                <History style={{ width: '16px', height: '16px' }} />
                Segarkan Log
              </button>
            </div>

            {/* Logs Table */}
            <div style={{ overflowX: 'auto', background: 'rgba(12, 4, 20, 0.65)', border: '1px solid rgba(147, 51, 234, 0.15)', borderRadius: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '980px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(147, 51, 234, 0.15)', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                    <th style={{ padding: '16px', width: '180px' }}>Waktu</th>
                    <th style={{ padding: '16px', width: '150px' }}>Admin</th>
                    <th style={{ padding: '16px' }}>Aktivitas / Aksi</th>
                    <th style={{ padding: '16px', width: '140px' }}>Risiko</th>
                    <th style={{ padding: '16px', width: '280px' }}>IP & Lokasi</th>
                    <th style={{ padding: '16px', width: '260px' }}>Device</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((l) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid rgba(147, 51, 234, 0.08)', verticalAlign: 'top' }}>
                      <td style={{ padding: '16px', color: 'rgba(255,255,255,0.45)' }}>
                        {new Date(l.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          fontSize: '12px',
                          background: 'rgba(147, 51, 234, 0.15)',
                          border: '1px solid rgba(147, 51, 234, 0.3)',
                          color: '#c084fc',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontWeight: 700
                        }}>{l.admin_user}</span>
                      </td>
                      <td style={{ padding: '16px', color: '#fff', fontWeight: 500 }}>
                        <div>{l.action}</div>
                        {(l.origin || l.referer) && (
                          <div style={{ marginTop: '8px', display: 'grid', gap: '4px', color: 'rgba(255,255,255,0.42)', fontSize: '12px', lineHeight: 1.5 }}>
                            <span>Origin: {l.origin || 'Tidak tersedia'}</span>
                            <span>Referer: {l.referer || 'Tidak tersedia'}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          ...getRiskStyle(l.risk_level),
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 9px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 800,
                        }}>
                          {l.risk_level || 'Low'}
                        </span>
                        {l.risk_flags && (
                          <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.45)', fontSize: '12px', lineHeight: 1.45 }}>
                            {l.risk_flags}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.55 }}>
                        <div style={{ color: '#fff', fontWeight: 700 }}>{l.ip_address || 'Tidak tersedia'}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{l.location || 'Tidak tersedia'}</div>
                        {l.ip_address && l.ip_address !== 'Tidak tersedia' && (
                          <button
                            onClick={() => isIpSuspended(l.ip_address) ? handleUnsuspendIp(l.ip_address as string) : handleSuspendIp(l.ip_address, l.action)}
                            style={{
                              marginTop: '10px',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              border: isIpSuspended(l.ip_address) ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(239,68,68,0.35)',
                              background: isIpSuspended(l.ip_address) ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                              color: isIpSuspended(l.ip_address) ? '#86efac' : '#f87171',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            {isIpSuspended(l.ip_address) ? 'Buka Suspend' : 'Suspend IP'}
                          </button>
                        )}
                      </td>
                      <td style={{ padding: '16px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.5 }}>
                        <div style={{ fontWeight: 700 }}>{l.device || 'Tidak tersedia'}</div>
                        <div style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.42)', maxWidth: '360px', wordBreak: 'break-word' }}>
                          {l.user_agent || 'Tidak tersedia'}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>Belum ada aktivitas log.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalLogPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                <button
                  disabled={logsPage === 1}
                  onClick={() => setLogsPage(prev => Math.max(prev - 1, 1))}
                  style={pageBtnStyle(logsPage === 1)}
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalLogPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLogsPage(idx + 1)}
                    style={pageNumStyle(logsPage === idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={logsPage === totalLogPages}
                  onClick={() => setLogsPage(prev => Math.min(prev + 1, totalLogPages))}
                  style={pageBtnStyle(logsPage === totalLogPages)}
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Kontak & Sosial Media</h2>
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: savingSettings ? 'not-allowed' : 'pointer',
                  opacity: savingSettings ? 0.6 : 1,
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)',
                }}
              >
                {savingSettings ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxWidth: '640px',
                padding: '24px',
                background: 'rgba(12, 4, 20, 0.65)',
                border: '1px solid rgba(147, 51, 234, 0.15)',
                borderRadius: '20px',
              }}
            >
              {([
                { key: 'wa_stock_url', label: 'LINK WA KHUSUS STOCK', placeholder: 'https://wa.me/62...' },
                { key: 'wa_rental_url', label: 'LINK WA KHUSUS RENTAL', placeholder: 'https://wa.me/62...' },
                { key: 'wa_partner_url', label: 'LINK WA KHUSUS JOIN PP/PT', placeholder: 'https://wa.me/62...' },
                { key: 'instagram_url', label: 'LINK INSTAGRAM', placeholder: 'https://www.instagram.com/...' },
                { key: 'tiktok_url', label: 'LINK TIKTOK', placeholder: 'https://www.tiktok.com/@...' },
                { key: 'wa_channel_url', label: 'LINK SALURAN WHATSAPP', placeholder: 'https://whatsapp.com/channel/...' },
              ] satisfies Array<{ key: keyof SiteSettings; label: string; placeholder: string }>).map((field) => (
                <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={settingsForm[field.key]}
                    onChange={(e) => setSettingsForm({ ...settingsForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* --- PRODUCT FORM MODAL --- */}
      {showProductModal && (
        <div
          onClick={() => setShowProductModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '32px',
              background: '#0c0414',
              border: '1px solid rgba(147, 51, 234, 0.25)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '24px' }}>
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>NAMA PRODUK</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Contoh: Akun FF Old Season"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>DESKRIPSI</label>
                <textarea
                  rows={3}
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Detail spesifikasi akun..."
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>HARGA (IDR)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    placeholder="Harga dalam Rupiah"
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>KATEGORI</label>
                  <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} style={inputStyle}>
                    <option value="Free Fire">Free Fire</option>
                    <option value="Mobile Legends">Mobile Legends</option>
                    <option value="Rental">Rental</option>
                    <option value="JasaPost">JasaPost</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>STATUS</label>
                  <select value={prodStatus} onChange={(e) => setProdStatus(e.target.value)} style={inputStyle}>
                    <option value="Ready">Ready</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>GAMBAR PRODUK</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setProdDragActive(true); }}
                    onDragLeave={() => setProdDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setProdDragActive(false); handleProductFile(e.dataTransfer.files?.[0]); }}
                    onClick={() => document.getElementById('prod-file-input')?.click()}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: prodDragActive ? 'rgba(147, 51, 234, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: prodDragActive ? '1.5px dashed #a855f7' : '1.5px dashed rgba(147,51,234,0.25)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      minHeight: '110px',
                    }}
                  >
                    <input
                      id="prod-file-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProductFile(e.target.files?.[0])}
                      style={{ display: 'none' }}
                    />
                    {uploadingProdImage ? (
                      <span style={{ fontSize: '12px', color: '#c084fc', fontWeight: 600, textAlign: 'center' }}>Sedang memproses gambar, mohon tunggu...</span>
                    ) : prodImage ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', pointerEvents: 'none' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                          <img src={prodImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600 }}>Gambar berhasil diunggah</span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Klik atau seret untuk mengganti</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>Seret & taruh gambar di sini, atau klik untuk memilih file</span>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Format: PNG, JPG, JPEG, WEBP</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Conditional Rental Expiry Field */}
              {prodCategory === 'Rental' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>MASA HABIS RENTAL SAMPAI DENGAN</label>
                    <input
                      type="date"
                      value={prodRentEnd}
                      onChange={(e) => setProdRentEnd(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(147, 51, 234, 0.15)', paddingTop: '16px', marginTop: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>GALERI GAMBAR (MAKSIMAL 6)</label>
                    <div className="admin-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
                      {prodGallery.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => setProdGallery(prev => prev.filter((_, i) => i !== idx))}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: 'rgba(239,68,68,0.85)',
                              color: '#fff',
                              border: 'none',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {prodGallery.length < 6 && (
                        <div
                          onClick={() => document.getElementById('gallery-file-input')?.click()}
                          style={{
                            aspectRatio: '1/1',
                            borderRadius: '8px',
                            border: '1.5px dashed rgba(147,51,234,0.3)',
                            background: 'rgba(255,255,255,0.01)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            color: '#a855f7',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.background = 'rgba(147,51,234,0.05)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(147,51,234,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                        >
                          +
                          <input
                            id="gallery-file-input"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || [])
                              const remaining = Math.max(0, 6 - prodGallery.length)
                              const selectedFiles = files.slice(0, remaining)
                              try {
                                const uploaded = await Promise.all(
                                  selectedFiles.map((file) => uploadImageFile(file, { folder: 'gallery', maxSize: 1400, quality: 0.8 }))
                                )
                                if (uploaded.length > 0) {
                                  setProdGallery(prev => [...prev, ...uploaded].slice(0, 6))
                                }
                              } catch (error) {
                                alert(error instanceof Error ? error.message : 'Gagal upload galeri produk.')
                              }
                              e.currentTarget.value = ''
                            }}
                            style={{ display: 'none' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(147, 51, 234, 0.15)', paddingTop: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>PAKET HEMAT</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                      {prodPackages.map((pkg, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(147,51,234,0.1)', padding: '8px 12px', borderRadius: '10px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>{pkg.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f472b6' }}>{formatRupiah(pkg.price)}</span>
                            <button
                              type="button"
                              onClick={() => setProdPackages(prev => prev.filter((_, i) => i !== idx))}
                              style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '14px', padding: '2px' }}
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="admin-package-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: '8px', alignItems: 'end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>DURASI PAKET</span>
                        <input
                          type="text"
                          value={newPkgName}
                          onChange={(e) => setNewPkgName(e.target.value)}
                          placeholder="Contoh: 12 Jam"
                          style={{ ...inputStyle, padding: '8px 12px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>HARGA (IDR)</span>
                        <input
                          type="number"
                          value={newPkgPrice || ''}
                          onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                          placeholder="Contoh: 140000"
                          style={{ ...inputStyle, padding: '8px 12px' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newPkgName.trim() || newPkgPrice <= 0) return
                          setProdPackages(prev => [...prev, { name: newPkgName.trim(), price: newPkgPrice }])
                          setNewPkgName('')
                          setNewPkgPrice(0)
                        }}
                        style={{
                          padding: '10px 16px',
                          background: 'rgba(168,85,247,0.15)',
                          border: '1px solid rgba(168,85,247,0.4)',
                          borderRadius: '10px',
                          color: '#c084fc',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </>
              )}

              {prodCategory !== 'Rental' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(147, 51, 234, 0.15)', paddingTop: '16px', marginTop: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>GALERI GAMBAR PRODUK (MAKSIMAL 6)</label>
                  <div className="admin-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
                    {prodGallery.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => setProdGallery(prev => prev.filter((_, i) => i !== idx))}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'rgba(239,68,68,0.85)',
                            color: '#fff',
                            border: 'none',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          x
                        </button>
                      </div>
                    ))}
                    {prodGallery.length < 6 && (
                      <div
                        onClick={() => document.getElementById('gallery-file-input')?.click()}
                        style={{
                          aspectRatio: '1/1',
                          borderRadius: '8px',
                          border: '1.5px dashed rgba(147,51,234,0.3)',
                          background: 'rgba(255,255,255,0.01)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          color: '#a855f7',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.background = 'rgba(147,51,234,0.05)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(147,51,234,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)' }}
                      >
                        +
                        <input
                          id="gallery-file-input"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || [])
                            const remaining = Math.max(0, 6 - prodGallery.length)
                            const selectedFiles = files.slice(0, remaining)
                            try {
                              const uploaded = await Promise.all(
                                selectedFiles.map((file) => uploadImageFile(file, { folder: 'gallery', maxSize: 1400, quality: 0.8 }))
                              )
                              if (uploaded.length > 0) {
                                setProdGallery(prev => [...prev, ...uploaded].slice(0, 6))
                              }
                            } catch (error) {
                              alert(error instanceof Error ? error.message : 'Gagal upload galeri produk.')
                            }
                            e.currentTarget.value = ''
                          }}
                          style={{ display: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #a855f7)', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(236,72,153,0.3)' }}
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PARTNER FORM MODAL --- */}
      {showPartnerModal && (
        <div
          onClick={() => setShowPartnerModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '32px',
              background: '#0c0414',
              border: '1px solid rgba(147, 51, 234, 0.25)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '24px' }}>
              {editingPartner ? 'Edit Partner Resmi' : 'Tambah Partner Baru'}
            </h2>
            <form onSubmit={handleSavePartner} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>NAMA PARTNER</label>
                <input
                  type="text"
                  required
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="Contoh: Jean Store Official"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>DESKRIPSI</label>
                <textarea
                  rows={3}
                  required
                  value={partDesc}
                  onChange={(e) => setPartDesc(e.target.value)}
                  placeholder="Deskripsi layanan partner..."
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>WHATSAPP CHANNEL URL</label>
                  <input
                    type="text"
                    required
                    value={partWaUrl}
                    onChange={(e) => setPartWaUrl(e.target.value)}
                    placeholder="https://whatsapp.com/channel/..."
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>NOMOR WHATSAPP CHAT</label>
                  <input
                    type="text"
                    value={partWaNumber}
                    onChange={(e) => setPartWaNumber(e.target.value)}
                    placeholder="Contoh: 6287832017296"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>KATEGORI</label>
                  <select value={partCategory} onChange={(e) => setPartCategory(e.target.value)} style={inputStyle}>
                    <option value="Partner Resmi">Partner Resmi</option>
                    <option value="Blacklist">PT Blacklist</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>STATUS</label>
                  <select value={partStatus} onChange={(e) => setPartStatus(e.target.value)} style={inputStyle}>
                    <option value="Ready">Ready</option>
                    <option value="Not Active">Not Active</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>GAMBAR PARTNER</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setPartDragActive(true); }}
                    onDragLeave={() => setPartDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setPartDragActive(false); handlePartnerFile(e.dataTransfer.files?.[0]); }}
                    onClick={() => document.getElementById('part-file-input')?.click()}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: partDragActive ? 'rgba(147, 51, 234, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: partDragActive ? '1.5px dashed #a855f7' : '1.5px dashed rgba(147,51,234,0.25)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      minHeight: '110px',
                    }}
                  >
                    <input
                      id="part-file-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePartnerFile(e.target.files?.[0])}
                      style={{ display: 'none' }}
                    />
                    {uploadingPartImage ? (
                      <span style={{ fontSize: '12px', color: '#c084fc', fontWeight: 600, textAlign: 'center' }}>Sedang memproses gambar, mohon tunggu...</span>
                    ) : partImage ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', pointerEvents: 'none' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                          <img src={partImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600 }}>Gambar berhasil diunggah</span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Klik atau seret untuk mengganti</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>Seret & taruh gambar di sini, atau klik untuk memilih file</span>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Format: PNG, JPG, JPEG, WEBP</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #a855f7)', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(236,72,153,0.3)' }}
                >
                  Simpan Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADMIN ACCOUNT FORM MODAL --- */}
      {showAdminModal && (
        <div
          onClick={() => setShowAdminModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              borderRadius: '24px',
              padding: '32px',
              background: '#0c0414',
              border: '1px solid rgba(147, 51, 234, 0.25)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '24px' }}>
              {editingAdmin ? 'Ubah Password Admin' : 'Tambah Akun Admin Baru'}
            </h2>
            <form onSubmit={handleSaveAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>USERNAME</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingAdmin)}
                  value={newAdminUser}
                  onChange={(e) => setNewAdminUser(e.target.value)}
                  placeholder="Username admin baru"
                  style={{
                    ...inputStyle,
                    ...(editingAdmin ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
                  {editingAdmin ? 'PASSWORD BARU' : 'PASSWORD'}
                </label>
                <input
                  type="password"
                  required
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder={editingAdmin ? "Masukkan password baru" : "Password admin baru"}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #a855f7)', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(236,72,153,0.3)' }}
                >
                  {editingAdmin ? 'Simpan Password' : 'Tambah Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfirm && (
        <div
          onClick={() => setDeleteConfirm(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '400px',
              borderRadius: '24px',
              padding: '32px',
              background: '#0c0414',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.9)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <Trash2 style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
              Konfirmasi Hapus
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '24px' }}>
              Apakah Anda yakin ingin menghapus {deleteConfirm.type === 'product' ? 'produk' : deleteConfirm.type === 'partner' ? 'partner' : 'akun admin'} <strong style={{ color: '#fff' }}>&quot;{deleteConfirm.name}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)',
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .admin-page {
            padding-top: 72px !important;
          }
          .admin-container {
            padding: 0 14px 48px !important;
          }
          .admin-dashboard-header {
            align-items: flex-start !important;
            flex-direction: column !important;
            gap: 14px !important;
            padding: 16px !important;
            border-radius: 18px !important;
            margin-bottom: 20px !important;
          }
          .admin-dashboard-header > button {
            width: 100%;
            justify-content: center;
            min-height: 42px;
          }
          .admin-tabs {
            width: 100% !important;
            overflow-x: auto;
            border-radius: 18px !important;
            margin-bottom: 22px !important;
            scrollbar-width: none;
          }
          .admin-tabs::-webkit-scrollbar {
            display: none;
          }
          .admin-tabs button {
            flex: 0 0 auto;
            padding: 10px 14px !important;
            font-size: 12px !important;
          }
          .admin-modal-card {
            max-height: calc(100vh - 24px) !important;
            padding: 20px !important;
            border-radius: 18px !important;
          }
          .admin-form-grid,
          .admin-package-row {
            grid-template-columns: 1fr !important;
          }
          .admin-gallery-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }
        }
        @media (max-width: 420px) {
          .admin-gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>

    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '14px',
  borderRadius: '12px',
  color: '#fff',
  outline: 'none',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(147,51,234,0.15)',
  width: '100%',
}

const pageBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '6px 12px',
  borderRadius: '8px',
  background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(12,4,20,0.8)',
  border: '1px solid rgba(147,51,234,0.15)',
  color: disabled ? 'rgba(255,255,255,0.2)' : '#fff',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '13px',
  fontWeight: 600,
  transition: 'all 0.2s',
})

const pageNumStyle = (active: boolean): React.CSSProperties => ({
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: active ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(12,4,20,0.8)',
  border: active ? 'none' : '1px solid rgba(147,51,234,0.15)',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 700,
  boxShadow: active ? '0 0 10px rgba(236,72,153,0.3)' : 'none',
  transition: 'all 0.2s',
})
