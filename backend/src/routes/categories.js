const express = require('express')
const prisma = require('../prisma')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { userId: req.userId }
  })
  res.json(categories)
})

router.post('/', auth, async (req, res) => {
  try {
    const { name, icon, color, type } = req.body
    const category = await prisma.category.create({
      data: { name, icon, color, type, userId: req.userId }
    })
    res.json(category)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { icon, color } = req.body
    const cat = await prisma.category.findUnique({ where: { id: req.params.id } })
    if (!cat || cat.userId !== req.userId) return res.status(403).json({ error: 'Немає доступу' })
    const updated = await prisma.category.update({
      where: { id: req.params.id },
      data: { icon, color }
    })
    res.json(updated)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const cat = await prisma.category.findUnique({ where: { id: req.params.id } })
    if (!cat || cat.userId !== req.userId) return res.status(403).json({ error: 'Немає доступу' })
    await prisma.category.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router