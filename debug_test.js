const axios = require('axios');

async function run() {
  try {
    console.log('Testing Setup...');
    const s = await axios.post('http://localhost:3000/api/adventure/setup', {
      context: { timeLimit: 30, energy: 'Medium', mood: 'Curious', groupSize: 'Solo', environment: 'City' },
      mode: 'demo'
    });
    const { adventureId } = s.data;
    const missionId = s.data.missions[0].id;
    console.log('Adventure started:', adventureId);

    console.log('Testing Check-in...');
    const c = await axios.post('http://localhost:3000/api/adventure/checkin', {
      adventureId, observation: 'I found a blue bird', missionId, mode: 'demo'
    });
    console.log('Check-in success!');
  } catch (e) {
    console.error('FAILED:', e.response?.data || e.message);
    process.exit(1);
  }
}
run();
