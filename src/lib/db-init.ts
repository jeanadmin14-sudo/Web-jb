import { query, getDbPool } from './db'

export async function initializeDatabase() {
  const pool = getDbPool()
  if (!pool) {
    console.log('Database not configured. Skipping initialization.')
    return { success: false, reason: 'Database not configured' }
  }

  try {
    console.log('Initializing PostgreSQL database...')

    // 1. Create tables
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL DEFAULT 0,
        category TEXT NOT NULL DEFAULT 'Free Fire',
        status TEXT NOT NULL DEFAULT 'Ready',
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        rent_end_date TEXT
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS partners (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        wa_channel_url TEXT,
        image_url TEXT,
        status TEXT NOT NULL DEFAULT 'Online',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        username TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        admin_user TEXT NOT NULL,
        action TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    console.log('Tables initialized successfully.')

    // 2. Check if admin table is empty and insert default admin
    const adminsCount = await query('SELECT count(*) FROM admins')
    if (parseInt(adminsCount.rows[0].count, 10) === 0) {
      console.log('Admin table is empty. Seeding default admin...')
      await query(
        'INSERT INTO admins (username, password_hash) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        ['admin', 'admin123']
      )
    }

    // 3. Check if products table is empty and seed default products
    const prodCount = await query('SELECT count(*) FROM products')
    if (parseInt(prodCount.rows[0].count, 10) === 0) {
      console.log('Products table is empty. Seeding default products...')
      const defaultProducts = [
        {
          id: 'm1',
          name: 'Akun Free Fire Old Season 1',
          description: 'Set Sakura, Hip Hop, bundle langka lengkap, vault melimpah.',
          price: 1500000,
          category: 'Free Fire',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-12T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm2',
          name: 'Akun Mobile Legends Mythical Glory',
          description: 'Skins Collector Granger, Lightborn, KOF Gusion & Chou, winrate 72%.',
          price: 2200000,
          category: 'Mobile Legends',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-11T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm3',
          name: 'Rental Akun FF Max Skin Full',
          description: 'Rental harian akun Free Fire full skin senjata Evo max level.',
          price: 35000,
          category: 'Rental',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-10T00:00:00Z').toISOString(),
          rent_end_date: '2026-06-25',
        },
        {
          id: 'm4',
          name: 'Jasa Post Paid Promote Instagram',
          description: 'Paid promote ke 50k followers gaming target Indonesia.',
          price: 50000,
          category: 'JasaPost',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-09T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm5',
          name: 'Akun Free Fire Cobra Max + Evo Gun',
          description: 'Bundle Cobra, Evo Gun level 7, AK Dragon level 6, akun aman.',
          price: 850000,
          category: 'Free Fire',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-08T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm6',
          name: 'Akun Mobile Legends Legend Skin Alucard',
          description: 'Skin Obsidian Blade Alucard, 120 skin, all hero unlocked.',
          price: 1100000,
          category: 'Mobile Legends',
          status: 'Sold Out',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-07T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm7',
          name: 'Rental Akun MLBB Granger Starfall Knight',
          description: 'Rental 24 jam akun skin Legend Granger, full emblem max.',
          price: 45000,
          category: 'Rental',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-06T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm8',
          name: 'Paid Promote Story WhatsApp',
          description: 'Promosi produk game ke story WA views 2k+ aktif harian.',
          price: 25000,
          category: 'JasaPost',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-05T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm9',
          name: 'Akun FF Letda Hyper Clone',
          description: 'Bundle Letda Hyper, M1887 Rapper Underworld, MP40 Cobra.',
          price: 1200000,
          category: 'Free Fire',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-04T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm10',
          name: 'Akun Mobile Legends KOF Chou + Iori',
          description: 'Skin KOF Chou, Skin Hero Bruno, Skin Collector Wanwan.',
          price: 3500000,
          category: 'Mobile Legends',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-03T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm11',
          name: 'Rental Akun Steam Black Myth Wukong',
          description: 'Rental akun Steam offline mode game Black Myth Wukong harian.',
          price: 20000,
          category: 'Rental',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-02T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
        {
          id: 'm12',
          name: 'Jasa Post Feeds Partner Resmi',
          description: 'Post feeds partner resmi JBJean di Instagram & TikTok.',
          price: 150000,
          category: 'JasaPost',
          status: 'Ready',
          image_url: '/Logo.jpeg',
          created_at: new Date('2026-06-01T00:00:00Z').toISOString(),
          rent_end_date: null,
        },
      ]

      for (const p of defaultProducts) {
        await query(
          'INSERT INTO products (id, name, description, price, category, status, image_url, created_at, rent_end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [p.id, p.name, p.description, p.price, p.category, p.status, p.image_url, p.created_at, p.rent_end_date]
        )
      }
    }

    // 4. Check if partners table is empty and seed default partners
    const partCount = await query('SELECT count(*) FROM partners')
    if (parseInt(partCount.rows[0].count, 10) === 0) {
      console.log('Partners table is empty. Seeding default partners...')
      const defaultPartners = [
        {
          id: 'p1',
          name: 'Jean Store Official',
          description: 'Partner resmi top-up, rekber, dan rental aman bergaransi.',
          wa_channel_url: 'https://whatsapp.com/channel/0029VbBqyVG0AgWAXwVIu73m',
          image_url: '/Logo.jpeg',
          status: 'Ready',
          created_at: new Date('2026-06-12T00:00:00Z').toISOString(),
        },
      ]

      for (const pt of defaultPartners) {
        await query(
          'INSERT INTO partners (id, name, description, wa_channel_url, image_url, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [pt.id, pt.name, pt.description, pt.wa_channel_url, pt.image_url, pt.status, pt.created_at]
        )
      }
    }

    console.log('Database initialization completed successfully.')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to initialize database:', error)
    return { success: false, reason: error.message || error }
  }
}
