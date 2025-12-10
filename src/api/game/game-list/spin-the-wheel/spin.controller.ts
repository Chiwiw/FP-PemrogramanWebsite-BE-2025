import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { prisma, SuccessResponse } from '@/common';

import { questionBank } from './question-bank';

export const SpinController = Router()
  // GET /topics
  .get(
    '/topics',
    (_request: Request, response: Response, next: NextFunction) => {
      try {
        const topics = Object.keys(questionBank);
        const result = new SuccessResponse(StatusCodes.OK, 'OK', { topics });

        return response.status(result.statusCode).json(result.json());
      } catch (error) {
        return next(error);
      }
    },
  )
  // GET /question?topic=xxx
  .get(
    '/question',
    (request: Request, response: Response, next: NextFunction) => {
      try {
        const topic = (
          request.query.topic as string | undefined
        )?.toLowerCase();

        if (!topic || !(topic in questionBank)) {
          return response.status(StatusCodes.BAD_REQUEST).json({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Invalid topic',
          });
        }

        const bank = questionBank[topic];
        const randomIndex = Math.floor(Math.random() * bank.length);
        const question = bank[randomIndex];

        // Response persis sesuai format yang diminta
        return response.status(StatusCodes.OK).json({
          question: question.question,
          options: question.options,
          answerIndex: question.answerIndex,
        });
      } catch (error) {
        return next(error);
      }
    },
  )
  // POST /submit
  .post(
    '/submit',
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { displayName, topic, score, timeSpent } = request.body ?? {};

        if (
          typeof displayName !== 'string' ||
          typeof topic !== 'string' ||
          typeof score !== 'number' ||
          typeof timeSpent !== 'number'
        ) {
          return response.status(StatusCodes.BAD_REQUEST).json({
            statusCode: StatusCodes.BAD_REQUEST,
            message:
              'Invalid body. Required: displayName(string), topic(string), score(number), timeSpent(number)',
          });
        }

        if (!(topic.toLowerCase() in questionBank)) {
          return response.status(StatusCodes.BAD_REQUEST).json({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Topic is not supported',
          });
        }

        await prisma.spinTheWheelScore.create({
          data: { displayName, topic: topic.toLowerCase(), score, timeSpent },
        });

        const result = new SuccessResponse(StatusCodes.CREATED, 'Submitted');

        return response.status(result.statusCode).json(result.json());
      } catch (error) {
        return next(error);
      }
    },
  )
  // GET /leaderboard?topic=xxx
  .get(
    '/leaderboard',
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const topic = (
          request.query.topic as string | undefined
        )?.toLowerCase();

        if (!topic || !(topic in questionBank)) {
          return response.status(StatusCodes.BAD_REQUEST).json({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Invalid topic',
          });
        }

        const rows = await prisma.spinTheWheelScore.findMany({
          where: { topic },
          orderBy: [
            { score: 'desc' },
            { timeSpent: 'asc' },
            { created_at: 'asc' },
          ],
          select: { displayName: true, score: true, timeSpent: true },
          take: 100,
        });

        return response.status(StatusCodes.OK).json({ leaderboard: rows });
      } catch (error) {
        return next(error);
      }
    },
  );
