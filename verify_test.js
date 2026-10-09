const axios = require('axios');

async function run() {
  try {
    console.log('Step 1: Setup...');
    const s = await axios.post('http://localhost:3000/api/adventure/setup', {
      context: { timeLimit: 30, energy: 'Medium', mood: 'Curious', groupSize: 'Solo', environment: 'City' },
      mode: 'demo'
    });
    const { adventureId } = s.data;
    const missionId = s.data.missions[0].id;
    console.log('Adventure started:', adventureId);

    console.log('Step 2: Check-in...');
    const c = await axios.post('http://localhost:3000/api/adventure/checkin', {
      adventureId, observation: 'I found a blue bird', missionId, mode: 'demo'
    });
    console.log('Check-in success! Next mission:', c.data.nextMission.title);
    console.log('VERIFIED');
  } catch (e) {
    console.error('FAILED:', e.response?.data || e.message);
  }
}
run();
