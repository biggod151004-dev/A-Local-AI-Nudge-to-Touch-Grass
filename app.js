const form = document.querySelector('#adventure-form');
const statusText = document.querySelector('#model-status');
const emptyState = document.querySelector('#empty-state');
const resultContent = document.querySelector('#result-content');
const resultTitle = document.querySelector('#result-title');
const resultIntro = document.querySelector('#result-intro');
const planName = document.querySelector('#plan-name');
const planDescription = document.querySelector('#plan-description');
const planSteps = document.querySelector('#plan-steps');
const planTime = document.querySelector('#plan-time');
let localGenerator;

const ideas = {
  'quiet noticing': { title: 'The five-senses loop', description: 'Take a slow loop near your starting point. The goal is not distance; it is noticing what your usual route edits out.', steps: ['Walk until you find one patch of shade.', 'Pause for two minutes and name five things you can hear.', 'Choose one texture or colour to remember on the way home.'] },
  'moving my body': { title: 'The choose-your-own hill', description: 'Find the nearest gentle rise, staircase, or long block. Let your pace change with the ground instead of tracking a score.', steps: ['Warm up with an easy five-minute walk.', 'Take the rise twice: once slowly, once at your natural pace.', 'Cool down and notice how your breathing changes.'] },
  'making something': { title: 'A tiny found-object studio', description: 'Make a temporary composition from what is already on the ground. Leave everything exactly where you found it.', steps: ['Collect three fallen, non-living objects in your eyes only.', 'Arrange them by shape, texture, or colour.', 'Take one photo if you like, then scatter the arrangement.'] },
  'meeting people': { title: 'The hello route', description: 'Walk somewhere with a little everyday life. Practise being a good neighbour without making the outing feel like networking.', steps: ['Choose a route with one local shop, bench, or shared space.', 'Offer one uncomplicated hello or thank-you.', 'Return by a different street and notice one new doorway.'] }
};

async function loadLocalModel() {
  try {
    const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2');
    env.allowLocalModels = false;
    localGenerator = await pipeline('text2text-generation', 'Xenova/flan-t5-small', { progress_callback: (p) => { if (p.status === 'progress' && p.progress > 1) statusText.textContent = 'Loading local AI…'; } });
    statusText.textContent = 'Local AI ready';
  } catch (error) {
    console.warn('Local model unavailable; using the offline plan library.', error);
    statusText.textContent = 'Offline plan library ready';
  }
}

function makeFallbackPlan({ place, time, energy, mood, noSignal, withFriend }) {
  const base = ideas[mood];
  const companion = withFriend ? ' Bring your friend into the noticing by taking turns choosing the next direction.' : '';
  const offline = noSignal ? ' Save this card now; it is designed to work without a signal once loaded.' : '';
  return { ...base, intro: `${time} in ${place}, with ${energy} energy, is enough for this.${companion}${offline}` };
}

async function makePlan(input) {
  const fallback = makeFallbackPlan(input);
  if (!localGenerator) return fallback;
  try {
    const prompt = `Create a short outdoor micro-adventure for ${input.time} in ${input.place}. Energy: ${input.energy}. Mood: ${input.mood}. Return one warm sentence only, no advice or safety warnings.`;
    const output = await localGenerator(prompt, { max_new_tokens: 45, temperature: 0.8 });
    const generated = output?.[0]?.generated_text?.trim();
    return generated ? { ...fallback, intro: generated } : fallback;
  } catch (error) { return fallback; }
}

function renderPlan(plan, input) {
  resultTitle.textContent = `${input.place}, your way`;
  resultIntro.textContent = plan.intro;
  planName.textContent = plan.title;
  planDescription.textContent = plan.description;
  planTime.textContent = input.time.toUpperCase();
  planSteps.innerHTML = plan.steps.map((step, index) => `<div class="plan-step"><span>0${index + 1}</span><div>${step}</div></div>`).join('');
  emptyState.classList.add('hidden');
  resultContent.classList.remove('hidden');
  document.querySelector('#result-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  const input = { place: document.querySelector('#place').value.trim(), time: document.querySelector('#time').value, energy: document.querySelector('#energy').value, mood: document.querySelector('#mood').value, noSignal: document.querySelector('#no-signal').checked, withFriend: document.querySelector('#with-friend').checked };
  button.disabled = true;
  button.querySelector('span:first-child').textContent = localGenerator ? 'Listening to the trail…' : 'Making your plan…';
  renderPlan(await makePlan(input), input);
  button.disabled = false;
  button.querySelector('span:first-child').textContent = 'Plan my micro-adventure';
});

document.querySelector('#reset-button').addEventListener('click', () => { resultContent.classList.add('hidden'); emptyState.classList.remove('hidden'); window.scrollTo({ top: document.querySelector('.workspace').offsetTop - 30, behavior: 'smooth' }); });
loadLocalModel();
