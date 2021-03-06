import axios, { AxiosInstance } from 'axios'
import { NLU } from 'botpress/sdk'
import * as sdk from 'botpress/sdk'

export type NLUApi = ReturnType<typeof makeApi>

export const makeApi = (bp: { axios: AxiosInstance }) => ({
  fetchContexts: (): Promise<string[]> => bp.axios.get('/nlu/contexts').then(res => res.data),
  fetchIntentsWithQNAs: (): Promise<NLU.IntentDefinition[]> => bp.axios.get('/nlu/intents').then(res => res.data),
  fetchIntents: async (): Promise<NLU.IntentDefinition[]> => {
    const { data } = await bp.axios.get('/nlu/intents')
    return data.filter(x => !x.name.startsWith('__qna__'))
  },
  fetchIntent: (intentName: string): Promise<NLU.IntentDefinition> =>
    bp.axios.get(`/nlu/intents/${intentName}`).then(res => res.data),
  createIntent: (intent: Partial<NLU.IntentDefinition>) => bp.axios.post('/nlu/intents', intent),
  updateIntent: (targetIntent: string, intent: Partial<NLU.IntentDefinition>): Promise<void> =>
    bp.axios.post(`/nlu/intents/${targetIntent}`, intent),
  deleteIntent: (name: string): Promise<void> => bp.axios.post(`/nlu/intents/${name}/delete`),
  syncIntentTopics: (intentNames?: string[]): Promise<void> =>
    bp.axios.post('/nlu/sync/intents/topics', { intentNames }),
  fetchEntities: (): Promise<NLU.EntityDefinition[]> => bp.axios.get('/nlu/entities').then(res => res.data),
  fetchEntity: (entityName: string): Promise<NLU.EntityDefinition> =>
    bp.axios.get(`/nlu/entities/${entityName}`).then(res => res.data),
  createEntity: (entity: NLU.EntityDefinition): Promise<void> => bp.axios.post('/nlu/entities/', entity),
  updateEntity: (targetEntityId: string, entity: NLU.EntityDefinition): Promise<void> =>
    bp.axios.post(`/nlu/entities/${targetEntityId}`, entity),
  deleteEntity: (entityId: string): Promise<void> => bp.axios.post(`/nlu/entities/${entityId}/delete`),
  train: (): Promise<void> => bp.axios.post('/mod/nlu/train'),
  cancelTraining: (): Promise<void> => bp.axios.post('/mod/nlu/train/delete')
})

export const createApi = async (bp: typeof sdk, botId: string) => {
  const axiosForBot = axios.create(await bp.http.getAxiosConfigForBot(botId, { localUrl: true }))
  const api = makeApi({ axios: axiosForBot })
  return api
}
