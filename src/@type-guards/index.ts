// オブジェクトに引数が含まれているかを判定
type WouldBe<T> = {[P in keyof T]?:unknown};
export default function isObject<T extends object>(value:any): value is WouldBe<T> {
  return typeof value === 'object' && value !== null;
}

// キャラクターの型ガード
export function isCharacter(value:any): value is Character {

  // アイコン情報を判定
  function isIconData(value:any): value is IconData {
    return isObject<IconData>(value)
      && typeof value.type === 'string'
      && typeof value.name === 'string'
      && typeof value.uri ==='string';
  }
  
  // キャラクターを判定
  return isObject<Character>(value)
    && typeof value.id === 'string'
    && typeof value.name === 'string'
    && (value.icon === undefined || isIconData(value.icon))
    && (typeof value.age === 'number' || typeof value.age === 'string')
    && (typeof value.gender === 'string' && ['男性','女性','両性','中性','無性','不定','不明'].includes(value.gender))
    && typeof value.firstPerson === 'string'
    && typeof value.secondPerson === 'string'
    && typeof value.personality === 'string'
    && typeof value.history === 'string'
    && typeof value.expression === 'string'
    && typeof value.principle === 'string'
    && Array.isArray(value.voices) && value.voices.every(v => typeof v === 'string');
}

// CCFOLIAのメッセージの型ガード
export function isCCMessage(value:any): value is CCMessage {
  return isObject<CCMessage>(value)
    && typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.text === 'string';
}

// Chrome拡張メッセージの型ガード
export function isCRXRequest(value:any):value is CRXRequest {
  return isObject<CRXRequest>(value)
    && typeof value.command === 'string'
    && typeof value.argument === 'object';
}

export function isCRXResponse(value:any):value is CRXResponse {
  return isObject<CRXResponse>(value)
    && typeof value.command === 'string'
    && typeof value.data === 'object';
}