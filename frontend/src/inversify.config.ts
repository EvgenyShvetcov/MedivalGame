import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./services/types";
import { AuthService } from "./services/AuthService";
import { PlayerService } from "./services/PlayerService";
import { LocationService } from "./services/LocationService";
import { BattleService } from "./services/BattleService";
import { ItemService } from "./services/ItemService";
import { ShopService } from "./services/ShopService";

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<PlayerService>(TYPES.PlayerService).to(PlayerService);
container.bind<LocationService>(TYPES.LocationService).to(LocationService);
container.bind<BattleService>(TYPES.BattleService).to(BattleService);
container.bind<ItemService>(TYPES.ItemService).to(ItemService);
container.bind<ShopService>(TYPES.ShopService).to(ShopService);

export { container };
