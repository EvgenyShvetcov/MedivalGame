import { DataSource } from 'typeorm';
import { Location } from '../location/entities/location.entity';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ??
    `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  synchronize: false,
  migrationsRun: false,
  entities: [Location],
});

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Location);

  const data: Partial<Location>[] = [
    {
      key: 'city',
      name: 'Город',
      description:
        'Центральная локация мира. Здесь можно отдохнуть, сходить в магазин и на арену.',
      imageUrl: '/static/locations/city.png',
      isCity: true,
    },
    {
      key: 'arena',
      name: 'Арена',
      description: 'Место, где бойцы сходятся в честной битве.',
      imageUrl: '/static/locations/arena.png',
      isBattleArena: true,
    },
    {
      key: 'shop',
      name: 'Торговый пост',
      description: 'Здесь можно приобрести всё необходимое.',
      imageUrl: '/static/locations/shop.png',
      isShop: true,
    },
    {
      key: 'forest',
      name: 'Лес',
      description: 'Тёмный и густой лес, полный загадок.',
      imageUrl: '/static/locations/forest.png',
    },
    {
      key: 'camp',
      name: 'Лагерь бандитов',
      description: 'Опасное место, где обитают разбойники.',
      imageUrl: '/static/locations/camp.png',
    },
    {
      key: 'castle',
      name: 'Замок',
      description: 'Старинный замок, превращённый в арену.',
      imageUrl: '/static/locations/castle.png',
      isBattleArena: true,
    },
  ];

  const savedLocations: Record<string, Location> = {};

  for (const loc of data) {
    const existing = await repo.findOne({ where: { key: loc.key } });
    if (existing) {
      Object.assign(existing, loc); // Обновим поля
      savedLocations[loc.key!] = await repo.save(existing);
    } else {
      const created = repo.create(loc);
      savedLocations[loc.key!] = await repo.save(created);
    }
  }

  // Связи
  savedLocations['city'].availableDestinations = [
    savedLocations['arena'],
    savedLocations['shop'],
    savedLocations['forest'],
  ];
  savedLocations['arena'].availableDestinations = [savedLocations['city']];
  savedLocations['shop'].availableDestinations = [savedLocations['city']];
  savedLocations['forest'].availableDestinations = [
    savedLocations['city'],
    savedLocations['camp'],
    savedLocations['castle'],
  ];
  savedLocations['camp'].availableDestinations = [savedLocations['forest']];
  savedLocations['castle'].availableDestinations = [savedLocations['forest']];

  await repo.save(Object.values(savedLocations));

  console.log('🌍 Полный мир засеян');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Ошибка при посеве:', err);
  process.exit(1);
});
