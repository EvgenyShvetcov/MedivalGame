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

  const city = repo.create({
    key: 'city',
    name: 'Город',
    description:
      'Центральная локация мира. Здесь можно отдохнуть, сходить в магазин и на арену.',
    imageUrl: '/static/locations/city.jpg',
    isCity: true,
  });

  const arena = repo.create({
    key: 'arena',
    name: 'Арена',
    description: 'Место, где бойцы сходятся в честной битве.',
    imageUrl: '/static/locations/arena.jpg',
    isBattleArena: true,
  });

  const shop = repo.create({
    key: 'shop',
    name: 'Торговый пост',
    description: 'Здесь можно приобрести всё необходимое.',
    imageUrl: '/static/locations/shop.jpg',
    isShop: true,
  });

  const forest = repo.create({
    key: 'forest',
    name: 'Лес',
    description: 'Тёмный и густой лес, полный загадок.',
    imageUrl: '/static/locations/forest.jpg',
  });

  const camp = repo.create({
    key: 'camp',
    name: 'Лагерь бандитов',
    description: 'Опасное место, где обитают разбойники.',
    imageUrl: '/static/locations/camp.jpg',
  });

  const castle = repo.create({
    key: 'castle',
    name: 'Замок',
    description: 'Старинный замок, превращённый в арену.',
    imageUrl: '/static/locations/castle.jpg',
    isBattleArena: true,
  });

  await repo.save([city, arena, shop, forest, camp, castle]);

  // Устанавливаем связи
  city.availableDestinations = [arena, shop, forest];
  arena.availableDestinations = [city];
  shop.availableDestinations = [city];
  forest.availableDestinations = [city, camp, castle];
  camp.availableDestinations = [forest];
  castle.availableDestinations = [forest];

  await repo.save([city, arena, shop, forest, camp, castle]);

  console.log('🌍 Полный мир засеян');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Ошибка при посеве:', err);
  process.exit(1);
});
