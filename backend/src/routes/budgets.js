const express = require('express')
const { z } = require('zod')
const prisma = require('../prisma')
const auth = require('../middleware/auth')

const router = express.Router()

const budgetSchema = z.object({
  categoryId: z.string().uuid('Невірний ID категорії'),
  amount: z.number({ coerce: true }).positive('Сума має бути більше 0').max(10_000_000),
  month: z.number({ coerce: true }).int().min(1).max(12),
  year: z.number({ coerce: true }).int().min(2020).max(2100),
})

// GET /api/budgets?month=5&year=2026
router.get('/', auth, async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1
    const year = parseInt(req.query.year) || new Date().getFullYear()

    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId, month, year },
      include: { category: true },
    })

    // Підрахунок витрат по кожній категорії за цей місяць
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        type: 'expense',
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
    })

    const spentByCat = {}
    for (const t of transactions) {
      spentByCat[t.categoryId] = (spentByCat[t.categoryId] || 0) + t.amount
    }

    const result = budgets.map(b => ({
      id: b.id,
      categoryId: b.categoryId,
      categoryName: b.category.name,
      categoryIcon: b.category.icon,
      amount: b.amount,
      spent: spentByCat[b.categoryId] || 0,
      month: b.month,
      year: b.year,
    }))

    res.json(result)
  } catch (e) {
    res.status(500).json({ error: 'Помилка сервера' })
  }
})

// POST /api/budgets — створити або оновити бюджет
router.post('/', auth, async (req, res) => {
  const parsed = budgetSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message })
  }

  try {
    const { categoryId, amount, month, year } = parsed.data

    // Перевірка що категорія належить юзеру
    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category || category.userId !== req.userId) {
      return res.status(403).json({ error: 'Категорія не знайдена' })
    }

    const budget = await prisma.budget.upsert({
      where: { userId_categoryId_month_year: { userId: req.userId, categoryId, month, year } },
      create: { userId: req.userId, categoryId, amount, month, year },
      update: { amount },
      include: { category: true },
    })

    res.json({
      id: budget.id,
      categoryId: budget.categoryId,
      categoryName: budget.category.name,
      categoryIcon: budget.category.icon,
      amount: budget.amount,
      spent: 0,
      month: budget.month,
      year: budget.year,
    })
  } catch (e) {
    res.status(500).json({ error: 'Помилка сервера' })
  }
})

// DELETE /api/budgets/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await prisma.budget.findUnique({ where: { id: req.params.id } })
    if (!budget) return res.status(404).json({ error: 'Бюджет не знайдено' })
    if (budget.userId !== req.userId) return res.status(403).json({ error: 'Немає доступу' })

    await prisma.budget.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Помилка сервера' })
  }
})

module.exports = router