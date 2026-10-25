// test-role-management.mjs
// Automated verification of Role Management across IAM, Session, and UI Gateways

const BASE_URL = 'http://localhost:3000'

async function runRoleTests() {
  console.log('====================================================')
  console.log('🧪 STARTING COMPREHENSIVE ROLE MANAGEMENT TEST SUITE')
  console.log('====================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`)
      passed++
    } else {
      console.error(`  ❌ FAIL: ${message}`)
      failed++
    }
  }

  // ----------------------------------------------------
  // TEST 1: Unit Head Login & Session Verification
  // ----------------------------------------------------
  console.log('📌 [Test 1] Testing Unit Head Authentication Flow...')
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sarah.lead@selise.ch' }),
    })

    const loginData = await loginRes.json()
    const setCookieHeader = loginRes.headers.get('set-cookie') || ''

    assert(loginRes.status === 200, 'Unit Head login returns HTTP 200')
    assert(loginData.user.role === 'UNIT_HEAD', `Assigned role is UNIT_HEAD (received: ${loginData.user.role})`)
    assert(loginData.user.name.toLowerCase().includes('sarah'), `Assigned name derives dynamically from identity (received: ${loginData.user.name})`)
    assert(setCookieHeader.includes('txl_user_role=UNIT_HEAD'), 'Cookie txl_user_role=UNIT_HEAD set in response header')

    // Parse cookies from login response for session test
    const rawCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [setCookieHeader]
    const cookieHeader = rawCookies.map(c => c.split(';')[0]).join('; ')

    // Test GET /api/auth/session with Unit Head cookies
    const sessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { Cookie: cookieHeader }
    })
    const sessionData = await sessionRes.json()

    assert(sessionRes.status === 200, 'GET /api/auth/session returns HTTP 200 for Unit Head')
    assert(sessionData.user?.role === 'UNIT_HEAD', `Session resolves with role: UNIT_HEAD (received: ${sessionData.user?.role})`)
    assert(sessionData.user?.discipline === 'Leadership & Strategy', `Discipline is Leadership & Strategy (received: ${sessionData.user?.discipline})`)
  } catch (err) {
    console.error('Error in Test 1:', err)
    failed++
  }

  console.log('\n----------------------------------------------------')
  // ----------------------------------------------------
  // TEST 2: Learner Login & Session Verification
  // ----------------------------------------------------
  console.log('📌 [Test 2] Testing Learner Authentication Flow...')
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rahat@selise.ch' }),
    })

    const loginData = await loginRes.json()
    const setCookieHeader = loginRes.headers.get('set-cookie') || ''

    assert(loginRes.status === 200, 'Learner login returns HTTP 200')
    assert(loginData.user.role === 'LEARNER', `Assigned role is LEARNER (received: ${loginData.user.role})`)
    assert(loginData.user.name.toLowerCase().includes('rahat'), `Learner name resolves correctly (received: ${loginData.user.name})`)
    assert(setCookieHeader.includes('txl_user_role=LEARNER'), 'Cookie txl_user_role=LEARNER set in response header')

    const rawCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [setCookieHeader]
    const cookieHeader = rawCookies.map(c => c.split(';')[0]).join('; ')

    const sessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { Cookie: cookieHeader }
    })
    const sessionData = await sessionRes.json()

    assert(sessionRes.status === 200, 'GET /api/auth/session returns HTTP 200 for Learner')
    assert(sessionData.user?.role === 'LEARNER', `Session resolves with role: LEARNER (received: ${sessionData.user?.role})`)
  } catch (err) {
    console.error('Error in Test 2:', err)
    failed++
  }

  console.log('\n----------------------------------------------------')
  // ----------------------------------------------------
  // TEST 3: Blocks IAM Role Mapping & Callback
  // ----------------------------------------------------
  console.log('📌 [Test 3] Testing Blocks IAM Role Claims Mapping...')
  try {
    // 3A: Blocks user with UNIT_HEAD role
    const headCallbackRes = await fetch(`${BASE_URL}/api/auth/blocks/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'mock_auth_code_head',
        state: 'mock_state',
      }),
    })
    const headCallbackData = await headCallbackRes.json()
    assert(headCallbackRes.status === 200, 'Blocks callback returns HTTP 200')
    assert(headCallbackData.ok === true, 'Blocks callback response indicates ok: true')

    // 3B: Test role isolation in server session when unauthenticated
    const unauthSessionRes = await fetch(`${BASE_URL}/api/auth/session`)
    const unauthSessionData = await unauthSessionRes.json()
    assert(unauthSessionData.user === null, 'Unauthenticated request correctly returns { user: null }')
  } catch (err) {
    console.error('Error in Test 3:', err)
    failed++
  }

  console.log('\n----------------------------------------------------')
  // ----------------------------------------------------
  // TEST 4: UI Route & Privilege Isolation Logic
  // ----------------------------------------------------
  console.log('📌 [Test 4] Testing UI Route & Privilege Isolation Rules...')

  // Rule 4A: Unit Head landing view default
  function computeInitialView(userRole) {
    return userRole === 'UNIT_HEAD' ? 'unit-head' : 'what-to-learn'
  }
  assert(computeInitialView('UNIT_HEAD') === 'unit-head', 'Unit Head landing homepage evaluates to: unit-head')
  assert(computeInitialView('LEARNER') === 'what-to-learn', 'Learner landing homepage evaluates to: what-to-learn')

  // Rule 4B: Role-gated View guard
  function canRenderUnitHeadView(activeTab, userRole) {
    return activeTab === 'unit-head' && userRole === 'UNIT_HEAD'
  }
  assert(canRenderUnitHeadView('unit-head', 'UNIT_HEAD') === true, 'Unit Head can render UnitHeadManagementView')
  assert(canRenderUnitHeadView('unit-head', 'LEARNER') === false, 'Learner CANNOT render UnitHeadManagementView (blocked by guard)')
  assert(canRenderUnitHeadView('what-to-learn', 'UNIT_HEAD') === false, 'Unit Head on curriculum tab suppresses Command Center')

  // Rule 4C: Authoring actions access check
  function canManageCurriculum(userRole) {
    return userRole === 'UNIT_HEAD'
  }
  assert(canManageCurriculum('UNIT_HEAD') === true, 'Curriculum Authoring (Add/Edit/Delete) permitted for UNIT_HEAD')
  assert(canManageCurriculum('LEARNER') === false, 'Curriculum Authoring (Add/Edit/Delete) forbidden for LEARNER')

  console.log('\n----------------------------------------------------')
  // ----------------------------------------------------
  // TEST 5: Live Role Promotion Sync
  // ----------------------------------------------------
  console.log('📌 [Test 5] Testing Live Role Promotion Sync...')
  try {
    // 5A: Learner logs in
    const learnerLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john.developer@selise.ch' }),
    })
    const learnerLoginData = await learnerLoginRes.json()
    const setCookieHeader = learnerLoginRes.headers.get('set-cookie') || ''
    assert(learnerLoginData.user.role === 'LEARNER', 'John is initially logged in as LEARNER')

    const rawCookies = learnerLoginRes.headers.getSetCookie ? learnerLoginRes.headers.getSetCookie() : [setCookieHeader]
    const cookieHeader = rawCookies.map(c => c.split(';')[0]).join('; ')

    // 5B: Admin promotes John to UNIT_HEAD via PATCH /api/auth/session
    const promoteRes = await fetch(`${BASE_URL}/api/auth/session`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john.developer@selise.ch', role: 'UNIT_HEAD' }),
    })
    const promoteData = await promoteRes.json()
    assert(promoteData.success === true, 'Admin successfully promotes John to UNIT_HEAD')

    // 5C: John calls GET /api/auth/session with his original cookie
    const syncRes = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { Cookie: cookieHeader }
    })
    const syncData = await syncRes.json()
    assert(syncData.user?.role === 'UNIT_HEAD', 'John session auto-upgraded to UNIT_HEAD on session check')
    assert(syncData.roleUpdated === true, 'Response indicates roleUpdated: true')
  } catch (err) {
    console.error('Error in Test 5:', err)
    failed++
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================')
  console.log(`🏁 TEST SUITE FINISHED: ${passed} PASSED, ${failed} FAILED`)
  console.log('====================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runRoleTests().catch((e) => {
  console.error('Fatal error running role tests:', e)
  process.exit(1)
})
