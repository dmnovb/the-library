import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db/index';
import z from 'zod'

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession();
        const user = getUser()

        if (!user.id || !user.email) {
            throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        const dbUser = await db.user.findFirst({
            where: {
                id: user.id,
            },
        })

        if (!dbUser) {
            await db.user.create({
            data: {
                id: user.id,
                email: user.email,
                },
            })
        }

        return {success: true}
    }),
    getUserBooks: privateProcedure.query(async ({ ctx }) => {
        const { userId } = ctx

        return await db.book.findMany({
            where: {
              userId,
            },
          })
    }),
    getBook: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const file = await db.book.findFirst({
        where: {
          key: input.key,
          userId,
        },
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      return file
    }),
    deleteUserBook: privateProcedure.input(z.object({
        id: z.string(),
    })).mutation(async ({ctx, input}) => {
        const { userId } = ctx

        const book = await db.book.findFirst({
            where: {
                id: input.id,
                userId: userId,
            }
        })

        if (!book) {
            throw new TRPCError({code: "NOT_FOUND"})
        }

        await db.book.delete({
            where: {
                id: input.id,
                userId: userId,
            }
        })

        return book
    })
});

export type AppRouter = typeof appRouter;