/* eslint-disable import/no-default-export */
import { Router } from 'express';

import { SpinController } from './spin.controller';

const spinRouter = Router();

// base path: /api/game/game-type/spin-the-wheel
spinRouter.use('/', SpinController);

export default spinRouter;
