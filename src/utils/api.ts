import { post } from "./axiosUtils"

import { ExecuteResult } from "../types/base"


export const run = (code: string): Promise<ExecuteResult> => post(`/run`, {
    lean_code: code
})


