/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import { type Prisma, type ROLE } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';

import {
  ErrorResponse,
  type ISpinTheWheelJson,
  type ISpinTheWheelQuestion,
  prisma,
} from '@/common';
import { FileManager } from '@/utils';

import {
  type ICreateSpinTheWheel,
  type IFinishSpin,
  type IUpdateSpinTheWheel,
} from './schema/spin-the-wheel.schema';

export abstract class SpinTheWheelService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static GAME_SLUG = 'spin-the-wheel';

  static async createGame(data: ICreateSpinTheWheel, user_id: string) {
    await this.existGameCheck(data.name);

    const newGameId = v4();
    const gameTemplateId = await this.getGameTemplateId();

    const thumbnailImagePath = await FileManager.upload(
      `game/spin-the-wheel/${newGameId}`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      data.thumbnail_image,
    );

    const gameJson: ISpinTheWheelJson = {
      totalRounds: typeof data.totalRounds === 'number' ? data.totalRounds : 5,
      questions: data.questions as ISpinTheWheelQuestion[],
    };

    const newGame = await prisma.games.create({
      data: {
        id: newGameId,
        game_template_id: gameTemplateId,
        creator_id: user_id,
        name: data.name,
        description: data.description,
        thumbnail_image: thumbnailImagePath,
        is_published: !!data.is_publish_immediately,
        game_json: gameJson as unknown as Prisma.InputJsonValue,
      },
      select: {
        id: true,
      },
    });

    return newGame;
  }

  static async getGameDetail(
    game_id: string,
    user_id: string,
    user_role: ROLE,
  ) {
    const game = await prisma.games.findUnique({
      where: { id: game_id },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail_image: true,
        is_published: true,
        created_at: true,
        game_json: true,
        creator_id: true,
        total_played: true,
        game_template: {
          select: { slug: true },
        },
      },
    });

    if (!game || game.game_template.slug !== this.GAME_SLUG)
      throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game not found');

    if (user_role !== 'SUPER_ADMIN' && game.creator_id !== user_id)
      throw new ErrorResponse(
        StatusCodes.FORBIDDEN,
        'User cannot access this game',
      );

    return {
      ...game,
      creator_id: undefined,
      game_template: undefined,
    };
  }

  static async getGamePlay(
    game_id: string,
    is_public: boolean,
    user_id?: string,
    user_role?: ROLE,
  ) {
    const game = await prisma.games.findUnique({
      where: { id: game_id },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail_image: true,
        is_published: true,
        game_json: true,
        creator_id: true,
        game_template: {
          select: { slug: true },
        },
      },
    });

    if (
      !game ||
      (is_public && !game.is_published) ||
      game.game_template.slug !== this.GAME_SLUG
    )
      throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game not found');

    if (
      !is_public &&
      user_role !== 'SUPER_ADMIN' &&
      game.creator_id !== user_id
    )
      throw new ErrorResponse(
        StatusCodes.FORBIDDEN,
        'User cannot get this game data',
      );

    const gameJson = game.game_json as unknown as ISpinTheWheelJson | null;

    if (!gameJson)
      throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game data not found');

    // Sanitization for Public endpoint
    let questions = gameJson.questions;

    if (is_public) {
      questions = questions.map(q => ({
        question: q.question,
        options: q.options,
        answerIndex: -1, // HIDE IT
      })) as ISpinTheWheelQuestion[];
    }

    return {
      id: game.id,
      name: game.name,
      description: game.description,
      thumbnail_image: game.thumbnail_image,
      totalRounds: gameJson.totalRounds,
      questions: is_public
        ? questions.map(q => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { answerIndex, ...rest } = q;

          return rest;
        })
        : gameJson.questions,
      is_published: game.is_published,
    };
  }

  static async updateGame(
    data: IUpdateSpinTheWheel,
    game_id: string,
    user_id: string,
    user_role: ROLE,
  ) {
    const game = await prisma.games.findUnique({
      where: { id: game_id },
      select: {
        id: true,
        name: true,
        thumbnail_image: true,
        game_json: true,
        creator_id: true,
        game_template: {
          select: { slug: true },
        },
      },
    });

    if (!game || game.game_template.slug !== this.GAME_SLUG)
      throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game not found');

    if (user_role !== 'SUPER_ADMIN' && game.creator_id !== user_id)
      throw new ErrorResponse(
        StatusCodes.FORBIDDEN,
        'User cannot access this game',
      );

    if (data.name) {
      const isNameExist = await prisma.games.findUnique({
        where: { name: data.name },
        select: { id: true },
      });

      if (isNameExist && isNameExist.id !== game_id)
        throw new ErrorResponse(
          StatusCodes.BAD_REQUEST,
          'Game name is already used',
        );
    }

    const oldGameJson = game.game_json as unknown as ISpinTheWheelJson | null;
    let thumbnailImagePath = game.thumbnail_image;

    if (data.thumbnail_image) {
      if (game.thumbnail_image) {
        await FileManager.remove(game.thumbnail_image);
      }

      thumbnailImagePath = await FileManager.upload(
        `game/spin-the-wheel/${game_id}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        data.thumbnail_image,
      );
    }

    // Handle flexible questions input
    let newQuestions = oldGameJson?.questions ?? [];

    if (data.questions) {
      if (typeof data.questions === 'string') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          newQuestions = JSON.parse(data.questions);
        } catch { } // eslint-disable-line no-empty
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        newQuestions = data.questions;
      }
    }

    const gameJson: ISpinTheWheelJson = {
      totalRounds: data.totalRounds
        ? Number(data.totalRounds)
        : (oldGameJson?.totalRounds ?? 5),
      questions: newQuestions,
    };

    const updatedGame = await prisma.games.update({
      where: { id: game_id },
      data: {
        name: data.name,
        description: data.description,
        thumbnail_image: thumbnailImagePath,
        is_published: data.is_publish,
        game_json: gameJson as unknown as Prisma.InputJsonValue,
      },
      select: {
        id: true,
      },
    });

    return updatedGame;
  }

  static async deleteGame(game_id: string, user_id: string, user_role: ROLE) {
    const game = await prisma.games.findUnique({
      where: { id: game_id },
      select: {
        id: true,
        thumbnail_image: true,
        creator_id: true,
        game_template: { select: { slug: true } },
      },
    });

    if (!game || game.game_template.slug !== this.GAME_SLUG)
      throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game not found');

    if (user_role !== 'SUPER_ADMIN' && game.creator_id !== user_id)
      throw new ErrorResponse(
        StatusCodes.FORBIDDEN,
        'User cannot delete this game',
      );

    if (game.thumbnail_image) {
      await FileManager.remove(game.thumbnail_image);
    }

    await prisma.games.delete({ where: { id: game_id } });

    return { id: game_id };
  }

  // --- GAMEPLAY LOGIC ---

  static async spin(gameId: string) {
    const game = await prisma.games.findUnique({
      where: { id: gameId },
    });

    if (!game) throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game not found');
    const gameJson = game.game_json as unknown as ISpinTheWheelJson;

    const questions = gameJson.questions;

    if (!questions || questions.length === 0) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, 'No questions in game');
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];

    return {
      questionIndex: randomIndex,
      question: question.question,
      options: question.options,
    };
  }

  static async checkAnswer(
    gameId: string,
    questionIndex: number,
    answerIndex: number,
  ) {
    const game = await prisma.games.findUnique({
      where: { id: gameId },
    });

    if (!game) throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game not found');
    const gameJson = game.game_json as unknown as ISpinTheWheelJson;
    const question = gameJson.questions[questionIndex];

    if (!question)
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Invalid question index',
      );

    const isCorrect = question.answerIndex === answerIndex;
    const score = isCorrect ? 20 : 0;

    return {
      isCorrect,
      score,
      correctAnswerIndex: question.answerIndex,
    };
  }

  static async finishGame(
    gameId: string,
    data: IFinishSpin,
    userId?: string | null,
  ) {
    // Validate game exists
    const game = await prisma.games.findUnique({ where: { id: gameId } });
    if (!game) throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game not found');

    // Create leaderboard entry
    await prisma.leaderboard.create({
      data: {
        game_id: gameId,
        user_id: userId || null,
        score: data.totalScore,
        time_taken: data.totalTimeTaken,
      },
    });

    return { message: 'Score saved successfully' };
  }

  static async getLeaderboard(game_id: string) {
    const leaderboard = await prisma.leaderboard.findMany({
      where: { game_id },
      orderBy: [{ score: 'desc' }, { time_taken: 'asc' }],
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      take: 20,
    });

    return leaderboard;
  }

  private static async existGameCheck(game_name?: string, game_id?: string) {
    const where: Record<string, unknown> = {};
    if (game_name) where.name = game_name;
    if (game_id) where.id = game_id;

    if (Object.keys(where).length === 0) return null;

    const game = await prisma.games.findFirst({
      where,
      select: { id: true, creator_id: true },
    });

    if (game)
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Game name is already exist',
      );

    return game;
  }

  private static async getGameTemplateId() {
    const result = await prisma.gameTemplates.findUnique({
      where: { slug: this.GAME_SLUG },
      select: { id: true },
    });

    if (!result)
      throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game template not found');

    return result.id;
  }
}
