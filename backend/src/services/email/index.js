export { transporter, EMAIL_APP_NAME, EMAIL_CLIENT_URL, EMAIL_FROM } from "./transporter.js";
export { sendWelcomeEmail } from "./welcomeEmail.js";
export { sendPasswordResetEmail } from "./resetPasswordEmail.js";
export { sendVerificationEmail } from "./verifyEmail.js";



/* 

how to use it.


import {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
} from "../services/email/index.js";

// In auth.service.js
await sendWelcomeEmail({ email: user.email, name: user.name });
await sendPasswordResetEmail(user.email, resetToken);
await sendVerificationEmail(user.email, verificationToken);


import { sendWelcomeEmail } from "../services/email/index.js";

await sendWelcomeEmail({ email: user.email, name: user.name });
*/


/* 
Some Better folder structure for future. 

Real Example: Your Project

services/
├── email/
│   ├── transporter.js          → export const transporter
│   ├── welcomeEmail.js         → export const sendWelcomeEmail
│   ├── resetPasswordEmail.js   → export const sendResetPasswordEmail
│   └── index.js                ← barrel
│
├── auth/
│   ├── register.service.js     → export const registerUser
│   ├── login.service.js        → export const loginUser
│   ├── refresh.service.js      → export const refreshToken
│   └── index.js                ← barrel
│
└── index.js                    ← top-level barrel (optional)

services/email/index.js

export { transporter } from "./transporter.js";
export { sendWelcomeEmail } from "./welcomeEmail.js";
export { sendResetPasswordEmail } from "./resetPasswordEmail.js";


services/auth/index.js

export { registerUser } from "./register.service.js";
export { loginUser } from "./login.service.js";
export { refreshToken } from "./refresh.service.js";

services/index.js (top-level barrel)

export * from "./email/index.js";
export * from "./auth/index.js";


Now in your controller:
Which is very neat & clean. 

// Before
import { registerUser } from "../services/auth/register.service.js";
import { sendWelcomeEmail } from "../services/email/welcomeEmail.js";

// After
import { registerUser, sendWelcomeEmail } from "../services/index.js";
*/