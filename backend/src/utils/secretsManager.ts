import {
	GetSecretValueCommand,
	SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";

export const getSecretValue = async (secretName: string) => {
	try {
		const client = new SecretsManagerClient({
			region: process.env.REGION,
		});
		const response = await client.send(
			new GetSecretValueCommand({
				SecretId: secretName,
			}),
		);
		if (!response.SecretString) {
			throw new Error(`Failed to get SecretString:${secretName}`);
		}
		return response.SecretString;
	} catch (error) {
		logger.error("Failed to get SecretString Request:", toError(error));
		throw error;
	}
};
