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

// サービスワーカーに渡すリクエスト
type CRXRequestBase<T,U> = {
  command: T,
  argument: U,
};
type CRXRequest =
  | CRXRequestBase<'getAllCharacters',{}>
  | CRXRequestBase<'getCharacterByID',{id:string}>
  | CRXRequestBase<'createCharacter',{}>
  | CRXRequestBase<'updateCharacter',Character>
  | CRXRequestBase<'deleteCharacter',{id:string}>;

// サービスワーカーから受け取るレスポンス
type CRXResponseBase<T,U> = {
  command: T,
  data: U,
};
type CRXResponse = 
  | CRXResponseBase<'getAllCharacters',Character[]>
  | CRXResponseBase<'getCharacterByID',Character>
  | CRXResponseBase<'createCharacter',Character>
  | CRXResponseBase<'updateCharacter',{}>
  | CRXResponseBase<'deleteCharacter',{}>;