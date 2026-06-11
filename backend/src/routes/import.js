const express = require('express')
const prisma = require('../prisma')
const auth = require('../middleware/auth')

const router = express.Router()

const Anthropic = require('@anthropic-ai/sdk')
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Швидкий keyword fallback (для офлайн / помилки AI)
const keywordMap = {
  'сільпо': 'Їжа', 'silpo': 'Їжа', 'атб': 'Їжа', 'atb': 'Їжа',
  'новус': 'Їжа', 'novus': 'Їжа', 'фора': 'Їжа', 'mcdonald': 'Їжа',
  'kfc': 'Їжа', 'pizza': 'Їжа', 'піца': 'Їжа', 'суші': 'Їжа',
  'metro cash': 'Їжа', 'ашан': 'Їжа', 'варус': 'Їжа',
  'uber': 'Транспорт', 'bolt': 'Транспорт', 'uklon': 'Транспорт',
  'wog': 'Транспорт', 'okko': 'Транспорт', 'Shell': 'Транспорт',
  'укрзалізниця': 'Транспорт', 'socar': 'Транспорт', 'паркінг': 'Транспорт',
  'parking': 'Транспорт', 'азс': 'Транспорт',
  'steam': 'Розваги', 'netflix': 'Розваги', 'spotify': 'Розваги',
  'youtube': 'Розваги', 'playstation': 'Розваги', 'multiplex': 'Розваги',
  'аптека': 'Здоров\'я', 'pharmacy': 'Здоров\'я', 'медицина': 'Здоров\'я',
  'лікарня': 'Здоров\'я', 'стоматолог': 'Здоров\'я',
  'zara': 'Одяг', 'h&m': 'Одяг', 'reserved': 'Одяг', 'adidas': 'Одяг', 'nike': 'Одяг',
  'київенерго': 'Комунальні', 'газ': 'Комунальні', 'водоканал': 'Комунальні',
  'kyivstar': 'Комунальні', 'vodafone': 'Комунальні', 'lifecell': 'Комунальні',
  'зарплата': 'Зарплата', 'salary': 'Зарплата', 'аванс': 'Зарплата',
  'upwork': 'Фріланс', 'freelance': 'Фріланс',
  'upwork': 'Фріланс', 'freelance': 'Фріланс', 'фріланс': 'Фріланс',
'термінал': 'Зарплата', 'від ': 'Зарплата', 'виплата': 'Зарплата',
'кешбек': 'Кешбек', 'cashback': 'Кешбек', 'бонус': 'Кешбек',
'rozetka': 'Техніка', 'розетка': 'Техніка', 'comfy': 'Техніка',
'eldorado': 'Техніка', 'фокстрот': 'Техніка',
'lifecell': 'Зв\'язок', 'kyivstar': 'Зв\'язок', 'vodafone': 'Зв\'язок',
'київстар': 'Зв\'язок', 'інтернет': 'Зв\'язок',
'booking': 'Подорожі', 'airbnb': 'Подорожі', 'hotel': 'Подорожі',
'готель': 'Подорожі', 'wizz': 'Подорожі', 'ryanair': 'Подорожі',
'mcdonald': 'Кафе та ресторани', 'kfc': 'Кафе та ресторани',
'pizza': 'Кафе та ресторани', 'піца': 'Кафе та ресторани',
'суші': 'Кафе та ресторани', 'sushi': 'Кафе та ресторани',
'ресторан': 'Кафе та ресторани', 'кафе': 'Кафе та ресторани',
'lviv croissants': 'Кафе та ресторани', 'starbucks': 'Кафе та ресторани',
'нова пошта': 'Інше', 'нп': 'Інше', 'easypay': 'Комунальні',
'оренда': 'Житло', 'аренда': 'Житло',
'зоо': 'Тварини', 'ветеринар': 'Тварини', 'зоомагазин': 'Тварини',
'салон': 'Краса та догляд', 'перукарня': 'Краса та догляд',
'beauty': 'Краса та догляд', 'nail': 'Краса та догляд',
}

const keywordFallback = (description, categories) => {
  const lower = description.toLowerCase()
  for (const [keyword, categoryName] of Object.entries(keywordMap)) {
    if (lower.includes(keyword.toLowerCase())) {
      const found = categories.find(c => c.name === categoryName)
      if (found) return found
    }
  }
  return categories.find(c => c.name === 'Інше') || categories[0]
}

// AI категоризація батчем
const aiCategorize = async (transactions, categories) => {
  const categoryNames = categories.map(c => c.name).join(', ')
  
  const items = transactions.map((tx, i) => 
    `${i}: "${tx.description}" (${tx.type === 'income' ? 'дохід' : 'витрата'}, ₴${tx.amount})`
  ).join('\n')

  const prompt = `Визнач категорію для кожної банківської транзакції.

Доступні категорії: ${categoryNames}

Транзакції:
${items}

Відповідай ТІЛЬКИ валідним JSON масивом, без пояснень:
[{"index": 0, "category": "Назва категорії"}, ...]

Правила:
- Використовуй ТІЛЬКИ категорії зі списку вище
- Якщо переказ між рахунками/картками — категорія "Інше", тип "transfer"
- Якщо не впевнений — "Інше"`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = message.content[0].text.trim()
  const json = JSON.parse(text.replace(/```json|```/g, '').trim())
  
  return json // [{ index, category }]
}

// Імпорт транзакцій
router.post('/', auth, async (req, res) => {
  try {
    const { transactions } = req.body

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ error: 'Немає транзакцій для імпорту' })
    }

    // Отримуємо категорії юзера
    const categories = await prisma.category.findMany({
      where: { userId: req.userId }
    })

    if (categories.length === 0) {
      return res.status(400).json({ error: 'Спочатку створи категорії' })
    }

    // Отримуємо існуючі транзакції для дедуплікації
    const dates = transactions.map(t => new Date(t.date))
    const minDate = new Date(Math.min(...dates))
    const maxDate = new Date(Math.max(...dates))

    const existing = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        date: { gte: minDate, lte: maxDate }
      }
    })

    // Створюємо сигнатури існуючих транзакцій
    const existingSignatures = new Set(
      existing.map(t => `${t.date.toISOString().split('T')[0]}_${t.amount}_${t.description}`)
    )

    // Фільтруємо дублікати і готуємо до збереження
    const toImport = []
    let duplicates = 0

    for (const tx of transactions) {
      const signature = `${new Date(tx.date).toISOString().split('T')[0]}_${tx.amount}_${tx.description}`

      if (existingSignatures.has(signature)) {
        duplicates++
        continue
      }

      // Знаходимо категорію
      let categoryId = tx.categoryId
      if (!categoryId) {
        const autoCategory = keywordFallback(tx.description || '', categories)
        categoryId = autoCategory?.id
      }

      if (!categoryId) continue

      toImport.push({
        amount: parseFloat(tx.amount),
        type: tx.type,
        description: tx.description || '',
        date: new Date(tx.date),
        userId: req.userId,
        categoryId
      })

      existingSignatures.add(signature)
    }

    // Масовий запис
    if (toImport.length > 0) {
      await prisma.transaction.createMany({ data: toImport })
    }

    res.json({
      imported: toImport.length,
      duplicates,
      total: transactions.length
    })
  } catch (e) {
    console.error('Import error:', e)
    res.status(500).json({ error: e.message })
  }
})

// Автокатегоризація (preview без збереження)
router.post('/preview', auth, async (req, res) => {
  try {
    const { transactions } = req.body

    const categories = await prisma.category.findMany({
      where: { userId: req.userId }
    })

    // Перевіряємо дублікати
    const dates = transactions.map(t => new Date(t.date))
    const minDate = new Date(Math.min(...dates))
    const maxDate = new Date(Math.max(...dates))

    const existing = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        date: { gte: minDate, lte: maxDate }
      }
    })

    const existingSignatures = new Set(
      existing.map(t => `${t.date.toISOString().split('T')[0]}_${t.amount}_${t.description}`)
    )

    // Спочатку keyword fallback для всіх
const withKeywords = transactions.map(tx => {
  const signature = `${new Date(tx.date).toISOString().split('T')[0]}_${tx.amount}_${tx.description}`
  const isDuplicate = existingSignatures.has(signature)
  const autoCategory = keywordFallback(tx.description || '', categories)
  const isOther = autoCategory?.name === 'Інше'

  return {
    ...tx,
    categoryId: autoCategory?.id || null,
    categoryName: autoCategory?.name || 'Інше',
    categoryIcon: autoCategory?.icon || '📦',
    autoDetected: !isOther,
    isDuplicate,
    _needsAI: isOther && !isDuplicate // позначаємо що треба AI
  }
})

// AI тільки для тих що пішли в "Інше"
const needsAI = withKeywords.filter(tx => tx._needsAI)

if (needsAI.length > 0) {
  try {
    const aiResults = await aiCategorize(needsAI, categories)
    
    aiResults.forEach(({ index, category }) => {
      const tx = needsAI[index]
      if (!tx) return
      const found = categories.find(c => c.name === category)
      if (found && found.name !== 'Інше') {
        tx.categoryId = found.id
        tx.categoryName = found.name
        tx.categoryIcon = found.icon || '📦'
        tx.autoDetected = true
      }
    })
  } catch (e) {
    console.error('AI categorization failed, using keywords only:', e.message)
  }
}

const previewed = withKeywords.map(tx => {
  const { _needsAI, ...rest } = tx
  return rest
})

res.json({ transactions: previewed, categories })
  } catch (e) {
    console.error('Preview error:', e)
    res.status(500).json({ error: e.message })
  }
})

module.exports = router