import { AppRouter } from '@/trpc/index'
import {createTRPCReact} from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>({})