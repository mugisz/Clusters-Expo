# ML Kit Image Labeling Implementation

## Overview

Цей проект інтегрує `@infinitered/react-native-mlkit-image-labeling` для автоматичного розпізнавання та кластеризації фотографій за їх змістом.

## Як це працює

### 1. **Завантаження фотографій**

- Встановлюється дозвіл на доступ до галереї
- Фотографії завантажуються пакетами по 30 фото
- Кожна фотографія обробляється послідовно ML Kit

### 2. **Аналіз змісту фотографій**

Для кожної фотографії ML Kit розпізнає:

- **Тварини**: Собака, Кіт, Птах, Кінь, Риба, Метелик та ін.
- **Природа**: Квіти, Рослина, Дерево, Небо, Хмари, Море, Océан та ін.
- **Їжа**: Їжа, Фрукти, Овочі, Десерт, Напій, Піца, Бургер та ін.
- **Люди**: Люди, Обличчя, Посмішка, Селфі, Портрет та ін.
- **Архітектура**: Будівля, Місто, Вулиця, Авто та ін.
- **События**: Вечірка, Свято, Весілля, День народження та ін.

### 3. **Міцки перекладаються на українську**

Всі мітки ML Kit переводяться на українську мову для кращого розуміння користувачем.

### 4. **Кластеризація фотографій**

Фотографії автоматично групуються за:

#### Першочерговість:

1. **За змістом (Content)** - Найголовніша категорія
   - Фотографії собак → "Собака" група
   - Фотографії кіт → "Кіт" група
   - Фотографії захід сонця → "Захід" група
   - І т.д.

2. **За часом (Time)** - Для фото без змісту або з малою кількістю
   - Групуються за місяцями
   - Приклад: "Січень 2026", "Лютий 2026"

3. **Інше (Other)** - Для решти фотографій

### 5. **Інформація про кластер**

Кожна група показує:

- **Назва**: Автоматично встановлена (наприклад, "Собака")
- **Кількість фото**: Скільки фото в групі
- **Період**: Дати першої та останньої фотографії
- **Мініатюри**: Усі фотографії в групі

## Структура файлів

```
hooks/
├── use-photo-clustering.ts    # Основний hook для кластеризації

utils/
├── clustering.ts              # Логіка групування фотографій

types/
├── photo.ts                   # TypeScript типи для Photo та PhotoCluster

app/
├── _layout.tsx               # Кореневий layout без провайдера
├── cluster/
│   └── [id].tsx              # Екран з деталями кластера
```

## Функціональність usePhotoClustering Hook

### Повернення:

```typescript
{
  clusters: PhotoCluster[];        // Усі кластери з фото
  isLoading: boolean;              // Чи відбувається завантаження
  error: string | null;            // Помилка, якщо є
  hasPermission: boolean | null;   // Чи є дозвіл до галереї
  requestPermission: () => Promise<void>;  // Запросити дозвіл
  refreshClusters: () => Promise<void>;    // Перезавантажити кластери
  totalPhotos: number;             // Усього фото завантажено
  progress: number;                // Прогрес завантаження
}
```

### Приклад використання:

```typescript
import { usePhotoClustering } from '@/hooks/use-photo-clustering';

export function PhotoClusters() {
  const {
    clusters,
    isLoading,
    error,
    hasPermission,
    requestPermission,
    totalPhotos,
    progress
  } = usePhotoClustering();

  if (!hasPermission) {
    return (
      <Button
        title="Дозволити доступ до фото"
        onPress={requestPermission}
      />
    );
  }

  if (isLoading) {
    return <Text>Завантаження... {progress}/{totalPhotos}</Text>;
  }

  if (error) {
    return <Text>Помилка: {error}</Text>;
  }

  return (
    <FlatList
      data={clusters}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
    />
  );
}
```

## Налаштування (ClusteringOptions)

```typescript
{
  minClusterSize: 2,                    // Мінімум 2 фото в групі
  maxTimeDifference: 7 * 24 * 60 * 60 * 1000,  // 7 днів
  useMLLabels: true                     // Використовувати ML Kit
}
```

## Переклади (підтримувані)

### Тварини

- dog → Собака
- cat → Кіт
- bird → Птах
- horse → Кінь
- fish → Риба
- butterfly → Метелик
- insect → Комаха
- animal → Тварина
- pet → Домашня тварина

### Природа

- flower → Квіти
- plant → Рослина
- tree → Дерево
- sky → Небо
- cloud → Хмари
- sunset → Захід
- sunrise → Схід
- mountain → Гори
- sea → Море
- ocean → Океан
- water → Вода
- beach → Пляж
- forest → Ліс
- nature → Природа

### Їжа

- food → Їжа
- fruit → Фрукти
- vegetable → Овочі
- dessert → Десерт
- drink → Напій
- pizza → Піца
- burger → Бургер
- cake → Торт
- salad → Салат

### Люди

- person → Люди
- people → Люди
- face → Обличчя
- smile → Посмішка
- selfie → Селфі
- portrait → Портрет
- human → Люди

### Архітектура

- building → Будівля
- architecture → Архітектура
- city → Місто
- street → Вулиця
- car → Авто
- vehicle → Транспорт
- road → Дорога

### События

- party → Вечірка
- celebration → Свято
- wedding → Весілля
- birthday → День народження
- concert → Концерт
- event → Подія

### Інше

- screenshot → Скріншот
- text → Текст
- document → Документ
- indoor → Приміщення
- outdoor → Вулиця
- night → Ніч
- day → День
- home → Дома

## Приклад вихідних даних

```json
{
  "clusters": [
    {
      "id": "ml-собака",
      "name": "Собака",
      "type": "content",
      "clusterType": "mixed",
      "description": "12 фотографій • 15.01.2026 — 18.01.2026",
      "startDate": "2026-01-15T10:30:00.000Z",
      "endDate": "2026-01-18T15:45:00.000Z",
      "photos": [
        {
          "id": "asset_123",
          "uri": "file:///path/to/photo.jpg",
          "creationTime": 1737189000000,
          "mlLabels": ["Собака", "Тварина", "Гра"],
          "width": 3840,
          "height": 2160
        }
      ]
    },
    {
      "id": "ml-квіти",
      "name": "Квіти",
      "type": "content",
      "clusterType": "mixed",
      "description": "8 фотографій • 10.01.2026 — 17.01.2026",
      "startDate": "2026-01-10T09:15:00.000Z",
      "endDate": "2026-01-17T14:20:00.000Z",
      "photos": []
    }
  ]
}
```

## Знаходження помилок / Тестування

Якщо виникають проблеми:

1. **Перевірте дозволи на доступ до галереї** - запит показується автоматично
2. **Перевірте ML Kit initialization** - дивіться console.warn logs
3. **Дивіться прогрес завантаження** - total/progress
4. **Перевірте error стан** - буде показана помилка

## Оптимізація

- **Batch Size**: 30 фото за раз (оптимально для ML Kit)
- **Confidence Threshold**: 0.3 (0-1 шкала)
- **Max Labels**: 5 міток на фото
- **Min Cluster Size**: 2 фото
