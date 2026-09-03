export const formats = [
  {
    id: 'nature',
    title: 'Природа',
    text: 'Леса, озёра и заповедники.',
    photo: '/photos/belovezha.jpg',
    tone: 'nature',
  },
  {
    id: 'history',
    title: 'История и культура',
    text: 'Города, память и живой культурный слой.',
    photo: '/photos/grodno-town.jpg',
    tone: 'history',
  },
  {
    id: 'adventure',
    title: 'Приключения',
    text: 'Сплавы, тропы и маршруты без натоптанных тротуаров.',
    photo: '/photos/pripyat.jpg',
    tone: 'adventure',
  },
  {
    id: 'gastro',
    title: 'Гастрономия',
    text: 'Местная кухня, рынки и вечерние улицы.',
    photo: '/photos/grodno-town.jpg',
    tone: 'gastro',
  },
  {
    id: 'unusual',
    title: 'Необычные места',
    text: 'Точки вне коротких списков must see.',
    photo: '/photos/kossovo.jpg',
    tone: 'unusual',
  },
  {
    id: 'architecture',
    title: 'Архитектура',
    text: 'Замки, дворцы, руины и плотные фасады.',
    photo: '/photos/nesvizh.jpg',
    tone: 'architecture',
  },
  {
    id: 'calm',
    title: 'Спокойный отдых',
    text: 'Вода, парки и дни без жёсткого плана.',
    photo: '/photos/braslav-2.jpg',
    tone: 'calm',
  },
] as const

export const durations = [
  { id: 'day', title: '1 день', text: 'Выезд утром, возвращение вечером.', hours: 10 },
  { id: 'weekend', title: '2–3 дня', text: 'Выходные с одной или двумя ночёвками.', hours: 36 },
  { id: 'week', title: 'Неделя', text: 'Достаточно, чтобы уехать далеко от Минска.', hours: 96 },
] as const

export const activities = [
  { id: 'low', title: 'Неспешно', text: 'Прогулки, смотровые точки, короткие переезды.' },
  { id: 'medium', title: 'Умеренно', text: 'Несколько точек в день без гонки.' },
  { id: 'high', title: 'Насыщенно', text: 'Длинные маршруты, ранние выезды, плотный день.' },
] as const

export const companies = [
  { id: 'solo', title: 'Один', text: 'Свободный график.' },
  { id: 'couple', title: 'Вдвоём', text: 'Камерный ритм.' },
  { id: 'friends', title: 'С друзьями', text: 'Общие активности.' },
  { id: 'family', title: 'С семьёй', text: 'Понятные переезды.' },
] as const

export const budgets = [
  { id: 'low', title: 'Скромно', text: 'До 80 BYN в день на человека.' },
  { id: 'mid', title: 'Средний', text: '80–160 BYN в день.' },
  { id: 'high', title: 'Свободный', text: 'От 160 BYN, без жёсткого потолка.' },
] as const

export const distances = [
  { id: 'near', title: 'Рядом с Минском', text: 'До 150 км, удобно на день.' },
  { id: 'region', title: 'По области', text: '150–280 км, с ночёвкой.' },
  { id: 'far', title: 'По всей стране', text: 'Дальше 280 км — запад, север, полесье.' },
] as const

export type FormatId = (typeof formats)[number]['id']
export type DurationId = (typeof durations)[number]['id']
export type ActivityId = (typeof activities)[number]['id']
export type CompanyId = (typeof companies)[number]['id']
export type BudgetId = (typeof budgets)[number]['id']
export type DistanceId = (typeof distances)[number]['id']

export type TripAnswers = {
  formats: FormatId[]
  duration: DurationId
  activity: ActivityId
  company: CompanyId
  budget: BudgetId
  distance: DistanceId
}

export type TagTone = (typeof formats)[number]['tone']
