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
  firstPerson: string,
  secondPerson: string,
  personality: string,
  history: string,
  expression: string,
  principle: string,
  voices: string[],
};

// キャラクタープロンプト
type CharacterPrompt = {
  id: string,
  prompt: string,
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
  // キャラクターの編集
  | CRXRequestBase<'getAllCharacters',{}>
  | CRXRequestBase<'getCharacterByID',{id:string}>
  | CRXRequestBase<'createCharacter',{}>
  | CRXRequestBase<'updateCharacter',Character>
  | CRXRequestBase<'deleteCharacter',{id:string}>
  // 設定の編集
  | CRXRequestBase<'getPreference',{}>
  | CRXRequestBase<'setPreference',{apiKey:string|null,maxRepeat:number|null}>;

// サービスワーカーから受け取るレスポンス
type CRXResponseBase<T,U> = {
  command: T,
  data: U,
};
type CRXResponse =
// キャラクターの編集
  | CRXResponseBase<'getAllCharacters',Character[]>
  | CRXResponseBase<'getCharacterByID',Character>
  | CRXResponseBase<'createCharacter',Character>
  | CRXResponseBase<'updateCharacter',{}>
  | CRXResponseBase<'deleteCharacter',{}>
  // 設定の編集
  | CRXResponseBase<'getPreference',{apiKey:string|null,maxRepeat:number|null}>
  | CRXResponseBase<'setPreference',{}>;