import { Controller } from '@nestjs/common';
import { WatchService } from './watch.service';

@Controller('watch')
export class WatchController {
  constructor(private readonly watchService: WatchService) {}
}
