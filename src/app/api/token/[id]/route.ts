import { tokenService } from "@/lib/modules/token/token-service"
import { validateApiSession } from "@/lib/utils/validate-api-session"

interface IParams {
  params: Promise<{ id: string }>
}

export async function GET (request: Request, { params }: IParams) {
  try {
    const { id } = await params
    await validateApiSession()

    const token = await tokenService().findById(id)

    if (!token || !token.isValid) {
      return Response.json({ error: 'Token não encontrado' }, { status: 404 })
    }

    return Response.json(token, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 401 })
    }

    return Response.json({ error: 'Sessão inválida' }, { status: 401 })
  }
}