import { z } from 'zod';

export const QuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).length(4),
  answerIndex: z.number().int().min(0).max(3),
});

export const CreateSpinTheWheelSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thumbnail_image: z.any().optional(), // File upload handled separately
  is_publish_immediately: z
    .string()
    .transform(value => value === 'true')
    .optional()
    .or(z.boolean().optional()),
  questions: z
    .string()
    .transform(value => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(value);
      } catch {
        return [];
      }
    })
    .pipe(z.array(QuestionSchema).min(1))
    .or(z.array(QuestionSchema).min(1)),
  totalRounds: z
    .string()
    .transform(value => Number.parseInt(value, 10))
    .optional()
    .or(z.number().int().min(1).optional()),
});

export const UpdateSpinTheWheelSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thumbnail_image: z.any().optional(),
  is_publish: z
    .string()
    .transform(value => value === 'true')
    .optional()
    .or(z.boolean().optional()),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: z.any().optional(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalRounds: z.any().optional(),
});

export const PlaySpinSchema = z.object({
  // Param game_id handled by router
});

export const AnswerSpinSchema = z.object({
  questionIndex: z.number().int().min(0),
  answerIndex: z.number().int().min(0).max(3),
});

export const FinishSpinSchema = z.object({
  totalScore: z.number().int().min(0),
  totalTimeTaken: z.number().min(0),
  userId: z.string().optional().nullable(),
});

export type ICreateSpinTheWheel = z.infer<typeof CreateSpinTheWheelSchema>;
export type IUpdateSpinTheWheel = z.infer<typeof UpdateSpinTheWheelSchema>;
export type IPlaySpin = z.infer<typeof PlaySpinSchema>;
export type IAnswerSpin = z.infer<typeof AnswerSpinSchema>;
export type IFinishSpin = z.infer<typeof FinishSpinSchema>;
