import OpenAI from 'openai';

import { apiKey } from '@/local/config';

import getCharacter from '../character';

// エイリアスを設定
type GPTMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

// OpenAIを初期化
const openai = new OpenAI({apiKey});

// キャラクターのセリフを生成する
export default async function characterSpeech(messages:CCMessage[], person:string) {

  // キャラクター情報を取得
  const {prompts} = getCharacter();

  // メッセージを変換する
  const complesions = messages.map<GPTMessage>(v => ({
    role: v.person === person ? 'assistant' : 'user',
    content: v.content,
  }));
  if(prompts[0].prompt !== '') {
    complesions.unshift({
      role: 'system',
      content: prompts[0].prompt
    });
  }

  // メッセージを変換してGPTに送信
  const response = await openai.chat.completions.create({
    model: 'gpt-4-0125-preview',
    messages: messages.map<GPTMessage>(v => ({
      role: v.person === person ? 'assistant' : 'user',
      content: v.content,
    })),
    max_tokens: 1024,
  });

  // 受け取ったメッセージを返す
  return response.choices[0].message.content ?? '';
}