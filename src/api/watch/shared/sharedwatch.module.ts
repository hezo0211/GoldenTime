import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Watch } from "../entities/watch.entity";
import { WatchService } from "../watch.service";

@Module({
    imports: [TypeOrmModule.forFeature([Watch])],
    providers:[WatchService],
    exports:[WatchService]
})
export class SharedWatchModule{}