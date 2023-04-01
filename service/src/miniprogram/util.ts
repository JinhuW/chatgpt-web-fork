import fs from 'fs'
import axios from 'axios'

export async function getWXAccessToken() {
  const config = {
    appId: process.env.COS_SECRET_ID,
    appSecret: process.env.COS_SECRET_KEY,
  }

  const tokenFileName = 'mp_token_info.json'
  const tokenInfo = await fs.existsSync(tokenFileName) ? JSON.parse(fs.readFileSync(tokenFileName, 'utf-8')) : null
  let expires_time = tokenInfo ? tokenInfo.expires_time : ''
  let cache_access_token = tokenInfo && tokenInfo.access_token ? tokenInfo.access_token : ''
  if ((Date.now() / 1000) > expires_time + 3600 || tokenInfo == null || cache_access_token === '') {
    const tokenForUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`
    const authResponse = await axios.get(tokenForUrl)
    cache_access_token = authResponse.data.access_token
    expires_time = Date.now() / 1000
    fs.writeFileSync(
      tokenFileName,
      JSON.stringify({
        access_token: cache_access_token,
        expires_time,
      }),
    )
    return { token: cache_access_token, expires_time }
  }
  else {
    return {
      token: tokenInfo.access_token,
      expires_time: tokenInfo.expires_time,
    }
  }
}

// POST https://api.weixin.qq.com/wxa/msg_sec_check?access_token=ACCESS_TOKEN
// https://developers.weixin.qq.com/minigame/dev/api-backend/open-api/sec-check/security.msgSecCheck.html#method-http
/**
 * use wx api to check if the message is safe
 * @param content
 * @param openId
 * @returns true - msg is risky
 */
export async function isRiskyMsg(content: string, openId?: string) {
  const { token } = await getWXAccessToken()

  const url = `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${token}`
  const data = {
    content,
    scene: 4,
  }
  const response = await axios.post(url, data)
  console.log(response.data)
  return response.data.errmsg !== 'ok'
}

// async function main() {
//   try {
//     const isSafe = await isSafeMsg('你好')
//     console.log(`My asynchronous function completed successfully.${JSON.stringify(isSafe)}`)
//   }
//   catch (error) {
//     console.error('Error occurred while running the asynchronous function:', error)
//   }
// }

// main()
