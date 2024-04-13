// アイコン情報
type IconData = {
  type: string,
  name: string,
  uri: string,
};

// キャラクター情報
type Character = {
  id: string,
  name: string,
  icon?: IconData,
  age: number|string,
  gender: '男性'|'女性'|'両性'|'中性'|'無性'|'不定'|'不明',
  person: string,
  history: string,
  voices: string[],
};

// 設定情報
type Preference = {
  apiKey?: string;
  maxRepeat?: number;
};

// CCFOLIA上でのメッセージ
type CCMessage = {
  id: string,
  name: string,
  text: string,
};

// Chrome拡張で受け渡すメッセージ
type CRXRequest = {
  command: string;
  argument: object;
};

type CRXResponse = {
  command: string;
  data: object;
}