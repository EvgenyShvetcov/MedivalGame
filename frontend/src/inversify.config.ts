import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./services/types";
import { AuthService } from "./services/AuthService";
import { PlayerService } from "./services/PlayerService";

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<PlayerService>(TYPES.PlayerService).to(PlayerService);

export { container };
