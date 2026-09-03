import type { Destination, RouteStop } from './types'

type Extra = Pick<
  Destination,
  | 'formats'
  | 'budget'
  | 'budgetLabel'
  | 'distanceKm'
  | 'distanceBand'
  | 'season'
  | 'lat'
  | 'lng'
  | 'stops'
>

function stop(
  id: string,
  title: string,
  text: string,
  durationMin: number,
  lat: number,
  lng: number,
  defaultFor: RouteStop['defaultFor'],
  kind: RouteStop['kind'] = 'stop',
): RouteStop {
  return { id, title, text, durationMin, lat, lng, defaultFor, kind }
}

export const extras: Record<string, Extra> = {
  nesvizh: {
    formats: ['history', 'architecture', 'calm'],
    budget: 'mid',
    budgetLabel: '90–140 BYN / день',
    distanceKm: 112,
    distanceBand: 'near',
    season: 'апрель — октябрь',
    lat: 53.2226,
    lng: 26.6772,
    stops: [
      stop('mir-gate', 'Остановка у Мира', 'Короткий взгляд на замок по дороге, если не сворачивать на полный осмотр.', 40, 53.4512, 26.473, ['weekend', 'week']),
      stop('nesvizh-palace', 'Несвижский замок', 'Дворец, двор и выход к воде. Главная точка дня.', 150, 53.2226, 26.6772, ['day', 'weekend', 'week']),
      stop('nesvizh-park', 'Замковый парк', 'Круг у пруда, где корпус читается целиком.', 80, 53.219, 26.689, ['day', 'weekend', 'week']),
      stop('nesvizh-town', 'Центр Несвижа', 'Фарный костёл и короткие улицы резиденции.', 60, 53.218, 26.672, ['weekend', 'week']),
      stop('nesvizh-finish', 'Вечер у дворца', 'Конечная точка: ужин и вид на воду.', 90, 53.223, 26.674, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
  mir: {
    formats: ['history', 'architecture'],
    budget: 'mid',
    budgetLabel: '70–120 BYN / день',
    distanceKm: 90,
    distanceBand: 'near',
    season: 'март — ноябрь',
    lat: 53.4512,
    lng: 26.473,
    stops: [
      stop('mir-castle', 'Мирский замок', 'Двор, башни и внешний обход.', 120, 53.4512, 26.473, ['day', 'weekend', 'week']),
      stop('mir-lake', 'Замковое озеро', 'Точка, где замок читается целиком.', 45, 53.448, 26.48, ['day', 'weekend', 'week']),
      stop('mir-town', 'Посёлок Мир', 'Тихие улицы вокруг комплекса.', 40, 53.454, 26.47, ['weekend', 'week']),
      stop('mir-finish', 'Возврат к замку', 'Последний кадр на закате или выезд в Минск.', 30, 53.451, 26.472, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
  belovezha: {
    formats: ['nature', 'adventure', 'unusual'],
    budget: 'mid',
    budgetLabel: '100–160 BYN / день',
    distanceKm: 380,
    distanceBand: 'far',
    season: 'май — сентябрь',
    lat: 52.57,
    lng: 23.81,
    stops: [
      stop('brest-gate', 'Брест, короткий вход', 'Холмские ворота по пути на запад, без полного дня в крепости.', 70, 52.083, 23.655, ['week']),
      stop('pushcha-entry', 'Каменюки', 'Вход в пущу, лесной посёлок, смена ритма.', 50, 52.56, 23.8, ['weekend', 'week']),
      stop('pushcha-bison', 'Вольеры', 'Зубры и ближний контакт с фауной.', 90, 52.575, 23.82, ['day', 'weekend', 'week']),
      stop('pushcha-trail', 'Реликтовый лес', 'Основная тропа через старые деревья.', 150, 52.59, 23.84, ['weekend', 'week']),
      stop('pushcha-finish', 'Ночёвка у леса', 'Конечная точка в пуще, без вечернего города.', 60, 52.568, 23.805, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
  braslav: {
    formats: ['nature', 'calm', 'adventure'],
    budget: 'mid',
    budgetLabel: '90–150 BYN / день',
    distanceKm: 220,
    distanceBand: 'region',
    season: 'июнь — сентябрь',
    lat: 55.6413,
    lng: 27.0418,
    stops: [
      stop('braslav-town', 'Браслав', 'Маленький центр озёрного края.', 40, 55.6413, 27.0418, ['weekend', 'week']),
      stop('braslav-snudy', 'Озеро Снуды', 'Широкая вода и рассветная точка.', 80, 55.66, 27.0, ['day', 'weekend', 'week']),
      stop('braslav-kayak', 'Струсто, выход на воду', 'Каяк между островами.', 180, 55.68, 27.05, ['weekend', 'week']),
      stop('braslav-hills', 'Холмы между озёрами', 'Вело- или пеший круг по берегам.', 120, 55.63, 27.08, ['week']),
      stop('braslav-finish', 'Берег на ночь', 'Конечная точка у воды, без городской программы.', 50, 55.645, 27.03, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
  grodno: {
    formats: ['history', 'gastro', 'architecture'],
    budget: 'mid',
    budgetLabel: '110–170 BYN / день',
    distanceKm: 278,
    distanceBand: 'region',
    season: 'круглый год, лучше май — октябрь',
    lat: 53.6694,
    lng: 23.8131,
    stops: [
      stop('grodno-castles', 'Старый и Новый замки', 'Две резиденции над Неманом.', 140, 53.677, 23.825, ['day', 'weekend', 'week']),
      stop('grodno-oldtown', 'Исторический центр', 'Костёлы, дворы, плотная улица.', 120, 53.678, 23.831, ['day', 'weekend', 'week']),
      stop('grodno-food', 'Вечерняя кухня', 'Ужин как часть маршрута, не как дополнение.', 90, 53.67, 23.82, ['weekend', 'week']),
      stop('grodno-canal', 'Августовский канал', 'Выезд к шлюзам и воде.', 180, 53.87, 23.62, ['week']),
      stop('grodno-finish', 'Набережная Немана', 'Конечная точка в городе.', 40, 53.675, 23.828, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
  kossovo: {
    formats: ['history', 'architecture', 'unusual'],
    budget: 'low',
    budgetLabel: '70–110 BYN / день',
    distanceKm: 210,
    distanceBand: 'region',
    season: 'апрель — октябрь',
    lat: 52.758,
    lng: 25.155,
    stops: [
      stop('kossovo-palace', 'Дворец Пусловских', 'Белый объём посреди пейзажа.', 100, 52.758, 25.155, ['day', 'weekend', 'week']),
      stop('kosciuszko', 'Меречёвщина', 'Усадьба, связанная с Костюшко.', 60, 52.76, 25.14, ['weekend', 'week']),
      stop('ruzhany-stop', 'Ружаны', 'Руины Сапег — второй сильный жест дня.', 100, 52.8636, 24.896, ['day', 'weekend', 'week']),
      stop('kossovo-finish', 'Западный вечер', 'Выезд через Барановичи или ночёвка у дворца.', 40, 52.76, 25.15, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
  polesie: {
    formats: ['nature', 'adventure', 'unusual'],
    budget: 'low',
    budgetLabel: '60–110 BYN / день',
    distanceKm: 320,
    distanceBand: 'far',
    season: 'май — сентябрь',
    lat: 52.0686,
    lng: 27.7378,
    stops: [
      stop('pinsk-edge', 'Пинск как вход', 'Речной фасад Полесья перед выездом к воде.', 80, 52.1229, 26.0958, ['week']),
      stop('turov', 'Туров', 'Древний центр, сегодня камерный город у воды.', 90, 52.0686, 27.7378, ['weekend', 'week']),
      stop('polesie-boat', 'Припять', 'Выход на реку. Без воды маршрут не складывается.', 150, 52.05, 27.8, ['day', 'weekend', 'week']),
      stop('polesie-park', 'Припятский парк', 'Тропы, птицы, низкий горизонт.', 160, 52.04, 28.05, ['week']),
      stop('polesie-finish', 'Берег Полесья', 'Ночёвка у реки.', 50, 52.06, 27.75, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
  pinsk: {
    formats: ['history', 'gastro', 'unusual'],
    budget: 'low',
    budgetLabel: '70–120 BYN / день',
    distanceKm: 310,
    distanceBand: 'far',
    season: 'май — октябрь',
    lat: 52.1229,
    lng: 26.0958,
    stops: [
      stop('pinsk-collegium', 'Иезуитский коллегиум', 'Главный фасад набережной.', 90, 52.1229, 26.0958, ['day', 'weekend', 'week']),
      stop('pinsk-river', 'Река Пина', 'Город читается от воды.', 70, 52.12, 26.11, ['day', 'weekend', 'week']),
      stop('pinsk-food', 'Полесский ужин', 'Кухня как причина остаться на ночь.', 90, 52.121, 26.09, ['weekend', 'week']),
      stop('pinsk-finish', 'Набережная', 'Конечная точка без выезда в столицу в тот же день.', 30, 52.123, 26.1, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
  vitebsk: {
    formats: ['history', 'gastro'],
    budget: 'mid',
    budgetLabel: '90–150 BYN / день',
    distanceKm: 280,
    distanceBand: 'region',
    season: 'май — сентябрь',
    lat: 55.1904,
    lng: 30.2049,
    stops: [
      stop('vitebsk-hills', 'Холмы над Двиной', 'Точки, откуда город читается целиком.', 90, 55.195, 30.2, ['day', 'weekend', 'week']),
      stop('vitebsk-center', 'Центр и набережная', 'Исторические улицы и река.', 120, 55.192, 30.205, ['day', 'weekend', 'week']),
      stop('vitebsk-art', 'Художественный слой', 'Музеи и адреса Шагала — по желанию.', 100, 55.193, 30.21, ['weekend', 'week']),
      stop('vitebsk-finish', 'Вечер на Двине', 'Конечная точка в городе.', 50, 55.19, 30.203, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
  brest: {
    formats: ['history', 'architecture'],
    budget: 'mid',
    budgetLabel: '90–150 BYN / день',
    distanceKm: 350,
    distanceBand: 'far',
    season: 'апрель — октябрь',
    lat: 52.0975,
    lng: 23.6877,
    stops: [
      stop('brest-fortress', 'Брестская крепость', 'Мемориал, который проходят пешком.', 180, 52.083, 23.655, ['day', 'weekend', 'week']),
      stop('brest-city', 'Центр Бреста', 'Пешеходная ось после крепости.', 90, 52.0975, 23.6877, ['day', 'weekend', 'week']),
      stop('brest-pushcha', 'Выезд к пуще', 'Если оставляете второй день на лес.', 90, 52.3, 23.9, ['week']),
      stop('brest-finish', 'Вечерний Брест', 'Город как конечная точка, не коридор.', 40, 52.096, 23.69, ['day', 'weekend', 'week'], 'finish'),
    ],
  },
}
