import { cookies } from "next/headers";
import { sessionService } from "../modules/session/session-service";

export async function validateApiSession () {
  try {
    const cookiesStore = await cookies()
    const sessionId = cookiesStore.get('sessionId')?.value

    if (!sessionId) throw new Error('Sessão inválida')

    const session = await sessionService().checkIfValid(sessionId)

    if (!session || session.isValid === false) {
      throw new Error('Sessão inválida')
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }

    throw new Error('Sessão inválida')
  }
}