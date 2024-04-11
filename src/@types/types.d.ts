type Character = {
  name: string,
  icon?: {
    type: string,
    name: string,
    uri: string,
  }
  age: number|string,
  gender: '男性'|'女性'|'両性'|'中性'|'無性'|'不定'|'不明',
  person: string,
  history: string,
};

type Preference = {
  apiKey: string,
  maxRepeat?: number,
};