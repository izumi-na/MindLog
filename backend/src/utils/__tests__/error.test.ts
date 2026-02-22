import { expect, test } from "vitest";
import { toError } from "../error";

test("should return the same Error instance when Error is passed", () => {
	const error = new Error("test error");
	expect(toError(error)).toBe(error);
});

test("should return the Error instance when string is passed", () => {
	const error = "test error";
	expect(toError(error)).toEqual(new Error("test error"));
});

test("should return the Error instance when not a string is passed", () => {
	const error = 1417419;
	expect(toError(error)).toEqual(new Error(String(error)));
});
