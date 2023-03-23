interface ChatMessage {
  role: string
  id: string
  parentMessageId: string
  text: string
  detail: {
    id: string
    object: string
    created: number
    model: string
    choices: {
      delta: any
      index: number
      finish_reason: string
    }[]
  }
}

export const fakeChatMessage = (imageUrl): ChatMessage => {
  return {
    role: 'assistant',
    id: 'chatcmpl-6x6GVnUnKUxuLbCl9aq18zhz4aWlP',
    parentMessageId: 'd7f457ad-c9ae-4fac-9e09-907cf9026663',
    text:
            `\n\n![image](${imageUrl})`,
    detail: {
      id: 'chatcmpl-6x6GVnUnKUxuLbCl9aq18zhz4aWlP',
      object: 'chat.completion.chunk',
      created: 1679543455,
      model: 'gpt-3.5-turbo-0301',
      choices: [
        {
          delta: {},
          index: 0,
          finish_reason: 'stop',
        },
      ],
    },
  }
}
