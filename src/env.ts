import Debug from 'debug'
const debug = Debug('syfol:env')
import * as joi from 'joi'

interface Env {
  SEARCH_QUERY: string,
  BATCH_INTERVAL: string,
  BATCH_QUANTITY: string,
  FOLLOW_PERIOD: string,
  FOLLOWER_LIMIT: string,
  EXCLUDE_USERS: string,

  TWITTER_CONSUMER_KEY: string,
  TWITTER_CONSUMER_SECRET: string,
  TWITTER_ACCESS_TOKEN_KEY: string,
  TWITTER_ACCESS_TOKEN_SECRET: string
}

/** A simple getter for `process.env` as a typed object for TS. */
let checkedEnv: boolean = false
export function getEnv (): Env {
  if (!checkedEnv) {
    validateEnv()
    checkedEnv = true
  }

  return process.env as any
}

/** Tests `process.env` to ensure all necessary variables have been set. */
function validateEnv () {
  debug('Checking environment variables')

  const def = (k: keyof Env, v: any) => 
    process.env[k] = process.env[k] || String(v)
  
  def('BATCH_INTERVAL', 60 * 60 * 1000)
  def('FOLLOW_PERIOD', 12 * 60 * 60 * 1000)
  def('EXCLUDE_USERS', '12')
  def('FOLLOWER_LIMIT', 1000)

  joi.assert(process.env, joi.object({
    SEARCH_QUERY: joi.string().min(1),
    BATCH_INTERVAL: joi.string().regex(/^\d+$/),
    BATCH_QUANTITY: joi.string().regex(/^\d+$/),
    FOLLOW_PERIOD: joi.string().regex(/^\d+$/),
    FOLLOWER_LIMIT: joi.string().regex(/^\d+$/),
    EXCLUDE_USERS: joi.string().regex(/^(\d+(\,\d+)*)?$/),

    TWITTER_CONSUMER_KEY: joi.string().min(20).max(35),
    TWITTER_CONSUMER_SECRET: joi.string().min(45).max(60),
    TWITTER_ACCESS_TOKEN_KEY: joi.string().min(45).max(60),
    TWITTER_ACCESS_TOKEN_SECRET: joi.string().min(40).max(55)
  }).unknown(true))

  // TODO test twitter keys

  debug('Environment variables are valid')
}