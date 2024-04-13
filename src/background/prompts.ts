import OpenAI from 'openai';
import { dedent } from '@qnighy/dedent';

import { apiKey } from '@/local/config';

// エイリアスを設定
type GPTMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

// OpenAIを初期化
const openai = new OpenAI({apiKey});

// キャラクタープロンプトを生成する
export async function characterPrompt(character:Character) {

  // 箇条書きを生成する
  const itemize = async (name:string, item:string) => {

    // 箇条書きにするプロンプト
    const prompt = dedent `これから「${name}」の${item}に関する文章が入力されます。
    # 制約条件 と # 出力形式 に従って「${name}」の${item}の要点をまとめてください。
    
    # 制約条件
    - 要点は箇条書きで示すこと
    - 箇条書きはそれぞれ「「${name}」は...」から始まること
    - 文末は「~です」や「~ます」などの丁寧な表現を使うこと
    
    # 出力形式
    - {要点1}
    - {要点2}
    ...`;

    // 送信するデータを組み立てる
    const messages:GPTMessage[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: character.personality }
    ];

    // プロンプトを送信する
    return await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: messages,
      max_tokens: 1024,
    });
  };

  // 制約条件
  const constraint = dedent `# 制約条件
    - Chatbotの自身を示す一人称は${character.firstPerson}です。
    - Userを示す二人称は${character.secondPerson}です。
    - Chatbotの名前は${character.name}です。
    - ${character.name}は${character.age}歳の${character.gender}です。
    ${await itemize(character.personality, '性格')}
    - 一人称は「${character.firstPerson}」を使ってください。
    `;

  // 口調・セリフの例
  const voices = character.voices.length === 0
    ? ''
    : dedent `# 口調・セリフの例
      ${character.voices.map(v => `「${v}」`).join('\n')}
      `;

  // 生成したプロンプトを返す
  return dedent `あなたはChatbotとして、${character.name}のロールプレイを行います。
    以下の制約条件を厳密に守ってロールプレイを行ってください。
    
    ${constraint}
    ${voices}`;
}