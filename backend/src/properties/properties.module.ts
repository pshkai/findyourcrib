import { Module } from "@nestjs/common";
import { RolesGuard } from "../auth/roles.guard";
import { AgentPropertiesController } from "./agent-properties.controller";
import { PropertiesController } from "./properties.controller";
import { PropertiesService } from "./properties.service";

@Module({
  controllers: [PropertiesController, AgentPropertiesController],
  providers: [PropertiesService, RolesGuard],
  exports: [PropertiesService]
})
export class PropertiesModule {}
