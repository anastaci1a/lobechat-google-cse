import { createErrorResponse, getPluginSettingsFromRequest, PluginErrorType } from "@lobehub/chat-plugin-sdk"

export const config = {
    runtime: 'edge'
}

export default async function (req: Request) {
    const params = await req.json()
    const settings = getPluginSettingsFromRequest(req)
    console.log('settings', settings)

    if (!settings) {
        return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
            message: 'Plugin settings not found.',
        })
    }

    try {
        const returnable: any[] = []
        const search = await fetch(`https://www.googleapis.com/customsearch/v1?key=${settings.API_KEY}&cx=${settings.ENGINE_ID}&q=${encodeURIComponent(params.query)}`)
        const json = await search.json()

        for (const item of json.items) {
            returnable.push({
                title: item.title,
                link: item.link,
                description: item.snippet,
            })
        }

        return new Response(JSON.stringify(returnable))
    } catch (err) {
        return createErrorResponse(PluginErrorType.PluginServerError, err as object)
    }
}