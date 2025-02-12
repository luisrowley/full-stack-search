import { getCodeSandboxHost } from "@codesandbox/utils";

export const CODE_SANDBOX_PORT = 3001;

const codeSandboxHost = getCodeSandboxHost(CODE_SANDBOX_PORT);

export const API_URL = codeSandboxHost ? `https://${codeSandboxHost}` : "http://localhost:3001";
export const DEBOUNCE_DELAY = 300;
