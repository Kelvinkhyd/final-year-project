import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding products...')

  // Delete existing products first to avoid duplicates
  await prisma.product.deleteMany({})

  const products = await prisma.product.createMany({
    data: [
      {
        id: 'prod-001',
        name: 'Global Wireless Headphones',
        description: 'Premium noise-cancelling headphones with multilingual voice assistant support',
        price: 89.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        stock: 50
      },
      {
        id: 'prod-002',
        name: 'International Travel Adapter',
        description: 'Universal plug adapter supporting 150+ countries with USB-C fast charging',
        price: 24.99,
        category: 'Travel',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        stock: 120
      },
      {
        id: 'prod-003',
        name: 'Multilingual Keyboard',
        description: 'Mechanical keyboard with switchable Latin, Arabic, and CJK key layouts',
        price: 149.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        stock: 30
      },
      {
        id: 'prod-004',
        name: 'World Atlas Collection',
        description: 'Hardcover atlas series covering global cultures, scripts, and languages',
        price: 34.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
        stock: 75
      },
      {
        id: 'prod-005',
        name: 'Smart Language Translator',
        description: 'Real-time translation device supporting 40+ languages including Arabic and Mandarin',
        price: 199.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=400',
        stock: 25
      },
      {
        id: 'prod-006',
        name: 'Global SIM Card Pack',
        description: 'Prepaid SIM card with data coverage in 80+ countries, multilingual support app',
        price: 49.99,
        category: 'Travel',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
        stock: 200
      }
    ]
  })

  console.log(`✅ Created ${products.count} products`)
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
