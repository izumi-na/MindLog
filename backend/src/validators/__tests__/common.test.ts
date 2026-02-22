import { v4 as uuidv4, v7 as uuidv7 } from "uuid";
import { expect, test } from "vitest";
import { isUuidValidateV7 } from "../common";

test("should return true when uuidv7 is passed", () => {
	const uuid = uuidv7();
	expect(isUuidValidateV7(uuid)).toBe(true);
});

test("should return false when uuidv4 is passed", () => {
	const uuid = uuidv4();
	expect(isUuidValidateV7(uuid)).toBe(false);
});

test("should return false when invalid UUID format is passed", () => {
	const uuid = "019a26ab-9a66-71a9-a89e-63c35-fce4a55";
	expect(isUuidValidateV7(uuid)).toBe(false);
});

test("should return false when string is passed", () => {
	const uuid = "fasfasdfasdfasdfasfakljkj;l";
	expect(isUuidValidateV7(uuid)).toBe(false);
});
