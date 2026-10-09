const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

async function simulateUser(userId) {
  try {
    console.log(`User ${userId}: Starting adventure...`);
    
    // 1. Setup adventure
    const setupRes = await axios.post('http://localhost:3000/api/adventure/setup', {
      context: {
        timeLimit: 30,
        energy: 'Medium',
        mood: 'Curious',
        groupSize: 'Solo',
        environment: `Test Zone ${userId}`
      },
      mode: 'demo'
    });
    
    const { adventureId } = setupRes.data;
    const missionId = setupRes.data.missions[0].id;
    console.log(`User ${userId}: Adventure ${adventureId} started.`);

    // 2. Submit observation
    console.log(`User ${userId}: Submitting observation...`);
    const checkinRes = await axios.post('http://localhost:3000/api/adventure/checkin', {
      adventureId,
      observation: `User ${userId} found a strange rock`,
      missionId,
      mode: 'demo'
    });

    console.log(`User ${userId}: Received adaptive mission: ${checkinRes.data.nextMission.title}`);
    return { status: 'success' };
  } catch (error) {
    console.error(`User ${userId}: Failed - ${error.message}`);
    return { status: 'fail', error: error.message };
  }
}

async function runStressTest() {
  const users = [];
  for (let i = 1; i <= 100; i++) {
    users.push(simulateUser(i));
  }

  console.log('🚀 Launching 100 concurrent users...');
  const results = await Promise.all(users);
  
  const success = results.filter(r => r.status === 'success').length;
  const fail = results.filter(r => r.status === 'fail').length;
  
  console.log('\n--- Stress Test Results ---');
  console.log(`Total Users: 100`);
  console.log(`Successful: ${success}`);
  console.log(`Failed: ${fail}`);
}

runStressTest();
