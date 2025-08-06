// SPDX-License-Identifier: Apache-2.0

import { randomInt } from "crypto"
import { promisify } from "util"

const PIN_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

export async function generateVerificationCode(): Promise<string> {
  let result = ""
  for (let i = 0; i < 8; i++) {
    const random_index = await randomIntAsync(0, PIN_CHARACTERS.length)
    result += PIN_CHARACTERS.charAt(random_index)
  }
  return result
}

export const randomIntAsync = promisify<number, number, number>(
  randomInt as (min: number, max: number) => number,
)
