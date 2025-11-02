// FIX: Implemented the SceneForm component for scene configuration and image generation submission.
import React, { useState } from 'react';
import { SceneConfig } from '../types';
import PresetInput from './PresetInput';
import SparklesIcon from './icons/SparklesIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DiceIcon from './icons/DiceIcon';

interface SceneFormProps {
  onSubmit: (sceneConfig: SceneConfig) => void;
  isLoading: boolean;
}

const actionPresets = [
    // Candid & Subtle
    "Subtly smiling at something off-camera",
    "Caught in the middle of a genuine laugh",
    "Adjusting their glasses or a piece of jewelry",
    "Fixing a stray hair from their face",
    "Tucking hair behind their ear",
    "Lost in thought, looking out a window",
    "Checking their phone with a neutral expression",
    "Glancing over their shoulder with a slight smile",
    "Leaning against a wall, looking relaxed and comfortable",
    "A candid moment of stretching, like just waking up",
    "Buttoning or unbuttoning a jacket",
    "Looking down at their shoes or the ground thoughtfully",
    "Playing with the sleeves of their sweater",
    "A moment of quiet contemplation, eyes closed",
    "Mid-speech, as if in the middle of a conversation",
    
    // Interaction with Objects
    "Taking a sip of coffee from a ceramic mug",
    "Reading a book in a cozy corner",
    "Working on a laptop in a cafe",
    "Typing on a vintage typewriter",
    "Arranging a small bouquet of flowers in a vase",
    "Holding a phone, screen illuminated on their face",
    "Flipping through a vinyl record in a store",
    "Sketching in a notebook with a concentrated look",
    "Holding a glass of wine up to the light",
    "Applying lipstick in a compact mirror",
    "Putting on or taking off headphones",
    "Eating a pastry at a bakery",
    "Holding an old film camera, about to take a picture",

    // Dynamic & Movement
    "Walking briskly down a city street, slight motion blur",
    "Stepping out of a vintage taxi cab",
    "Dancing freely in an empty room",
    "Running a hand through their hair while walking",
    "Hailing a cab on a rainy street",
    "Riding a bicycle down a tree-lined path",
    "Leaping over a puddle on the sidewalk",
    "Caught mid-stride while crossing the street",
    "Twirling in a flowy dress or skirt",

    // Posed & Intentional
    "Staring directly into the camera with a soft, inviting expression",
    "A confident power pose, hands on hips",
    "Sitting on the floor, surrounded by books and papers",
    "Curled up on a sofa with a blanket",
    "A classic 'outfit of the day' (OOTD) pose",
    "A quick mirror selfie with a phone",
    "Lying in a field of wildflowers",
    "Peeking out from behind a large plant or doorway",
    "Sitting on the edge of a bed, putting on shoes",
    "A 'plandid' (planned candid) pose, looking away thoughtfully",
];

const locationPresets = [
    // Urban & City
    "A bustling street market at noon",
    "On a crowded, graffiti-covered subway car",
    "A rooftop bar with a city view at night",
    "A vibrant, neon-lit alleyway in a city like Tokyo or Seoul",
    "An industrial loft apartment with large windows",
    "An old, ornate library with green lamps",
    "An empty movie theater after the show",
    "The steps of a grand, historic museum",
    "A gritty, underground parking garage with fluorescent lights",
    "A busy crosswalk with motion-blurred traffic",
    "A quiet, cobblestone street in a historic district",
    "Inside a classic, vintage taxi cab",
    "A sleek, modern airport lounge",
    "An empty basketball court in the city",

    // Cafes & Indoors
    "A quiet, minimalist art gallery",
    "A vintage, dimly-lit bookstore with towering shelves",
    "A plant-filled conservatory or greenhouse",
    "The aesthetic corner of a minimalist cafe",
    "A cozy, cluttered antique shop",
    "Inside a record store, surrounded by vinyl",
    "A hotel room with a stunning city view",
    "A moody, dimly-lit jazz club",
    "A busy, steamy kitchen during service",
    "An old-school laundromat at night",
    "A grand, sunlit staircase in a historic building",

    // Nature & Outdoors
    "A foggy, moody beach at sunrise",
    "A serene park with autumn leaves on the ground",
    "A sun-drenched Italian lemon grove",
    "A remote, scenic overlook in the mountains",
    "Deep inside a lush, green forest",
    "A hidden waterfall in a jungle",
    "A desert landscape at golden hour",
    "A snowy field during a light snowfall",
    "A wooden pier on a calm lake",
    "A vibrant field of sunflowers or lavender",
    "On a boat, with the coastline in the distance",
    
    // Unique & Specific
    "A colorful, aesthetic grocery store aisle",
    "An empty swimming pool with interesting tiles",
    "A charming Parisian balcony with a breakfast setup",
    "An old, beautiful European cathedral interior",
    "The interior of a luxurious private jet",
    "A vibrant, bustling night market in Asia",
    "An abandoned greenhouse, overgrown with plants",
    "A neon-lit arcade, surrounded by games",
    "In the driver's seat of a vintage car",
    "A grand, historic theater, sitting in an empty seat",
    "A local bakery, surrounded by fresh bread",
    "A moody, rain-streaked car interior at night",
];

const timeOfDayPresets = [
    // Golden Hours
    "Golden hour, just before sunset (warm, soft, directional light)",
    "Sunrise golden hour, just as the sun appears (crisp, warm light)",

    // Daylight
    "High noon, with harsh, direct sunlight and sharp, graphic shadows",
    "Overcast day, with soft, diffused, and even light (perfect for portraits)",
    "Mid-afternoon, bright and clear with a cool blue sky",
    "Dappled sunlight filtering through tree leaves",
    "Bright, indirect light coming from a large window",
    "Foggy morning, with muted colors and a soft, ethereal glow",

    // Evening & Night
    "Blue hour, the period just after sunset (cool, deep blue tones)",
    "Dusk, with city lights beginning to turn on against a fading sky",
    "Late at night, illuminated only by artificial street lighting (neon, warm lamps)",
    "Midnight, deep and dark with high contrast lighting",
    "Neon lights reflecting on wet pavement after rain",
    "The warm, intimate glow from a single candle or lamp",
    "The cool, blueish light from a phone or laptop screen at night",
    "Cozy, warm light from a fireplace",
    "The flickering, dynamic light of a bonfire",
    "Moonlight on a clear night, creating soft, cool shadows",

    // Specific & Stylistic
    "Direct, high-contrast flash photography at night",
    "Long exposure at night, creating light trails from traffic",
    "The hazy, dreamy light of a summer afternoon",
    "The dramatic, stormy light before a thunderstorm",
    "Silhouette against a bright sunset or sunrise",
    "Backlit by the sun, creating a glowing halo effect",
    "The soft, ambient light inside a tent at night",
    "Light filtered through colored glass or blinds, creating patterns",
];

const cameraAnglePresets = [
    // Standard & Common
    "Eye-level, as if shot by a friend standing nearby",
    "Medium shot, from the waist up (classic portrait style)",
    "Full-body shot, showing their entire outfit and posture",
    "Tight close-up, focusing on their expression and details (eyes, lips)",
    "Wide shot, capturing the subject within their grand environment",

    // Creative Angles
    "Low angle, looking slightly up at the subject (empowering)",
    "High angle, looking slightly down at the subject (intimate, thoughtful)",
    "Dutch angle, tilted for a dynamic or uneasy feeling",
    "Over-the-shoulder perspective, hinting at an interaction",
    "Point-of-view (POV), as if seeing through the influencer's eyes",

    // Candid & "Shot on Phone"
    "Quick mirror selfie with a phone visible in the shot",
    "0.5x ultra-wide angle from a low angle, creating slight distortion",
    "A messy, slightly blurry 'photo dump' style selfie",
    "Shot from the hip, without looking (a true candid)",
    "Taken through a reflective surface (puddle, shop window)",
    "FaceTime or video call perspective",
    "Shot from across the street with a zoom lens (paparazzi feel)",
    "Slightly out of focus, emphasizing mood over sharpness",
    "A quick, spontaneous shot with accidental motion blur",
    "Framed by a natural element (leaves, doorway)",
    
    // Compositional Techniques
    "Shot through a window or doorway, for a voyeuristic feel",
    "Rule of thirds, subject placed off-center",
    "Symmetrical, with the subject perfectly centered",
    "Leading lines, using roads or architecture to guide the eye",
    "Frame within a frame (using a window, archway, etc.)",
    "Shallow depth of field, with a very blurry background (bokeh)",
    "Deep depth of field, where everything is in sharp focus",
    "A 'detail shot,' focusing on hands, shoes, or an object they're holding",
    "Silhouette shot, with the subject dark against a bright background",
    "Panning shot, following a moving subject to blur the background",
    "A macro shot, extremely close to a small detail",
];


const SceneForm: React.FC<SceneFormProps> = ({ onSubmit, isLoading }) => {
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>({
    action: 'Subtly smiling at something off-camera',
    location: 'The aesthetic corner of a minimalist cafe',
    timeOfDay: 'Golden hour, just before sunset (warm, soft, directional light)',
    cameraAngle: 'Eye-level, as if shot by a friend standing nearby',
    additionalInstructions: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSceneConfig((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (value) {
        setSceneConfig(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(sceneConfig);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-surface rounded-lg border border-brand-border p-4 sm:p-6 space-y-6">
      <h2 className="text-xl font-semibold text-brand-secondary">2. Scene Configuration</h2>

      <PresetInput
        label="Action"
        name="action"
        value={sceneConfig.action}
        placeholder="e.g., sipping coffee, reading a book"
        presets={actionPresets}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />

      <PresetInput
        label="Location"
        name="location"
        value={sceneConfig.location}
        placeholder="e.g., bustling street market, quiet library"
        presets={locationPresets}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />
      
      <PresetInput
        label="Time Of Day"
        name="timeOfDay"
        value={sceneConfig.timeOfDay}
        placeholder="e.g., golden hour, moody night"
        presets={timeOfDayPresets}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />

      <PresetInput
        label="Camera Angle"
        name="cameraAngle"
        value={sceneConfig.cameraAngle}
        placeholder="e.g., eye-level, low angle"
        presets={cameraAnglePresets}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />
      
      <div>
        <label htmlFor="additionalInstructions" className="block text-sm font-medium text-brand-text mb-1">
          Additional Instructions (Optional)
        </label>
        <textarea
          id="additionalInstructions"
          name="additionalInstructions"
          rows={3}
          value={sceneConfig.additionalInstructions}
          onChange={handleInputChange}
          placeholder="e.g., wearing a red scarf, looking directly at the camera, a small cat is sleeping on the sofa in the background..."
          className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 text-brand-bg font-semibold rounded-md px-4 py-3 disabled:bg-brand-primary/50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="w-5 h-5 mr-2" />
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Generate Image
          </>
        )}
      </button>
    </form>
  );
};

export default SceneForm;
