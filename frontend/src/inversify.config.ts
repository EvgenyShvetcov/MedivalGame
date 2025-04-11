import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./services/types";
import { AuthService } from "./services/AuthService";
import { PlayerService } from "./services/PlayerService";
import { LocationService } from "./services/LocationService";
import { BattleService } from "./services/BattleService";

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<PlayerService>(TYPES.PlayerService).to(PlayerService);
container.bind<LocationService>(TYPES.LocationService).to(LocationService);
container.bind<BattleService>(TYPES.BattleService).to(BattleService);

export { container };
