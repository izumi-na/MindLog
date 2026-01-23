import { validate as uuidValidate, version as uuidVersion } from "uuid";

// 文字列が有効なv7のUUIDであるかチェック
export function isUuidValidateV7(uuid: string): boolean {
	return uuidValidate(uuid) && uuidVersion(uuid) === 7;
}
