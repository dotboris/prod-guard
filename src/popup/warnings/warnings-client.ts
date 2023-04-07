import browser from 'webextension-polyfill'
import { type WarningsApi } from '../../warnings-api'

type SendMessageRequest<FuncName extends keyof WarningsApi> =
  WarningsApi[FuncName] extends (arg: infer Arg) => any
    ? { type: FuncName } & Arg
    : WarningsApi[FuncName] extends () => any
    ? { type: FuncName }
    : never

type SendMessageResponse<FuncName extends keyof WarningsApi> =
  WarningsApi[FuncName] extends (...args: any) => Promise<infer Return>
    ? Promise<Return>
    : never

/**
 * Wrapper around {@link browser.runtime.sendMessage} with correct typing around
 * the {@link WarningsApi} implementation contract where the function name is in
 * the `type` field of the request.
 */
async function sendMessage<FuncName extends keyof WarningsApi>(
  req: SendMessageRequest<FuncName>
): Promise<SendMessageResponse<FuncName>> {
  const res = await browser.runtime.sendMessage(req)
  return res
}

export const getAllWarnings: WarningsApi['getAllWarnings'] = async () =>
  await sendMessage({ type: 'getAllWarnings' })

export const getWarning: WarningsApi['getWarning'] = async (req) =>
  await sendMessage({ type: 'getWarning', ...req })

export const addWarning: WarningsApi['addWarning'] = async (req) => {
  await sendMessage({ type: 'addWarning', ...req })
}

export const updateWarning: WarningsApi['updateWarning'] = async (req) => {
  await sendMessage({ type: 'updateWarning', ...req })
}

export const removeWarning: WarningsApi['removeWarning'] = async (req) => {
  await sendMessage({ type: 'removeWarning', ...req })
}
