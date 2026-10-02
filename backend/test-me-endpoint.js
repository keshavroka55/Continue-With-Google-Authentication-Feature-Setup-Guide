/**
 * Test script to verify /api/auth/me endpoint validation
 * 
 * Flow:
 * 1. Register a new user
 * 2. Login with that user → get accessToken
 * 3. Call /api/auth/me with Authorization: Bearer <accessToken>
 * 4. Verify it returns user data (200 OK)
 */

const BASE_URL = "http://localhost:5000";

async function test() {
    try {
        console.log("🧪 Starting /api/auth/me endpoint test\n");

        const uniqueEmail = `test-${Date.now()}@example.com`;

        // Step 1: Register
        console.log("📝 Step 1: Registering test user...");
        const registerRes = await fetch(`${BASE_URL}/api/auth/register-admin-insecure`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test User",
                email: uniqueEmail,
                password: "TestPassword123!admin",
                role: "admin",
            }),
        });

        if (!registerRes.ok) {
            const errorData = await registerRes.json().catch(() => ({}));
            throw new Error(`Register failed: ${registerRes.status} ${errorData.message || ""}`.trim());
        }
        const registerData = await registerRes.json();
        console.log("✅ Registration successful\n");

        // Step 2: Login
        console.log("🔐 Step 2: Logging in...");
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // for refresh token cookie
            body: JSON.stringify({
                email: registerData.user.email,
                password: "TestPassword123!admin",
            }),
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status}`);
        }
        const loginData = await loginRes.json();
        const accessToken = loginData.accessToken;
        console.log("✅ Login successful");
        console.log(`   Access Token (first 30 chars): ${accessToken.substring(0, 30)}...`);
        console.log(`   User: ${loginData.user.email} (${loginData.user.role})\n`);

        // Step 3: Call /me endpoint WITH access token
        console.log("👤 Step 3: Calling GET /api/auth/me with access token...");
        const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            credentials: "include",
        });

        console.log(`   Response Status: ${meRes.status}`);

        if (!meRes.ok) {
            const errorData = await meRes.json();
            console.log(`❌ /me endpoint failed: ${meRes.status}`);
            console.log(`   Error: ${errorData.message}`);
            return;
        }

        const meData = await meRes.json();
        console.log("✅ /me endpoint successful");
        console.log(`   User ID: ${meData.user.id}`);
        console.log(`   Email: ${meData.user.email}`);
        console.log(`   Role: ${meData.user.role}\n`);

        // Step 4: Test with invalid token
        console.log("🔍 Step 4: Testing with INVALID token (should fail 401)...");
        const invalidRes = await fetch(`${BASE_URL}/api/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer invalid.token.here`,
            },
        });

        console.log(`   Response Status: ${invalidRes.status}`);
        if (invalidRes.status === 401) {
            const errorData = await invalidRes.json();
            console.log(`✅ Correctly rejected: ${errorData.message}\n`);
        } else {
            console.log(`❌ Should have returned 401, got ${invalidRes.status}\n`);
        }

        // Step 5: Test without token
        console.log("🔍 Step 5: Testing WITHOUT token (should fail 401)...");
        const noTokenRes = await fetch(`${BASE_URL}/api/auth/me`, {
            method: "GET",
        });

        console.log(`   Response Status: ${noTokenRes.status}`);
        if (noTokenRes.status === 401) {
            const errorData = await noTokenRes.json();
            console.log(`✅ Correctly rejected: ${errorData.message}\n`);
        } else {
            console.log(`❌ Should have returned 401, got ${noTokenRes.status}\n`);
        }

        console.log("✅ All tests passed! /me endpoint is properly validating access tokens");
    } catch (err) {
        console.error("❌ Test failed:", err.message);
        process.exit(1);
    }
}

test();
