import {
	GetSecretValueCommand,
	SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";

const client = new SecretsManagerClient({
	region: process.env.REGION,
});

const cachedSecrets: Record<string, string> = {};

export const getSecretValue = async (secretName: string) => {
	if (cachedSecrets[secretName]) {
		return cachedSecrets[secretName];
	}
	try {
		const response = await client.send(
			new GetSecretValueCommand({
				SecretId: secretName,
			}),
		);
		if (!response.SecretString) {
			throw new Error(`Failed to get SecretString:${secretName}`);
		}
		cachedSecrets[secretName] = response.SecretString;
		return cachedSecrets[secretName];
	} catch (error) {
		logger.error("Failed to get SecretString Request:", toError(error));
		throw error;
	}
};
