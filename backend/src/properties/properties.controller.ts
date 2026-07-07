import { Controller, Get, Param, Query } from "@nestjs/common";
import { PropertySearchDto } from "./dto";
import { PropertiesService } from "./properties.service";

@Controller("properties")
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  search(@Query() query: PropertySearchDto) {
    return this.propertiesService.search(query);
  }

  @Get("featured")
  featured() {
    return this.propertiesService.featured();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.propertiesService.findOne(id);
  }
}
