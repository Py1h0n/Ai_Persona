// FIX: Implemented the SceneForm component to capture scene details from the user.
import React from 'react';
import { Scene } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface SceneFormProps {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
  onSubmit: () => void;
  isLoading: boolean;
  isReadyToGenerate: boolean;
}

const actionPresets = [
  "Looking thoughtfully out a window",
  "Casually sipping coffee in a cafe",
  "Walking through a bustling city street at night",
  "Reading a book in a cozy armchair",
  "Laughing with an unseen friend",
  "Working on a laptop in a minimalist office",
  "Exploring a misty forest trail",
  "Staring intensely at the camera",
  "Getting caught in a sudden downpour",
  "Browsing through a vintage record store",
  // --- NEW PRESETS START HERE ---
  "Adjusting their glasses or sunglasses",
  "Tucking a strand of hair behind their ear",
  "Leaning against a rustic brick wall",
  "Looking over their shoulder with a slight smile",
  "Holding a camera, as if taking a photo",
  "A candid moment of fixing their outfit",
  "Interacting with a pet (e.g., petting a cat)",
  "Unfocused, in the middle of a natural movement",
  "Applying lipstick in a mirror's reflection",
  "Stretching lazily after waking up",
  "Arranging flowers in a vase",
  "Typing on a vintage typewriter",
  "Hailing a taxi on a rainy city street",
  "Mid-laugh, head tilted back",
  "Holding a sparkler at night",
  "Peeking out from behind a large plant",
  "Eating a pastry at an outdoor Parisian cafe",
  "Riding a bicycle down a charming street",
  "Looking at a piece of art in a gallery",
  "Playing a vinyl record",
  "A blurry selfie in a moving car (passenger seat)",
  "Holding a coffee cup with both hands for warmth",
  "Checking their phone, illuminated by the screen's glow",
  "The moment of blowing out a candle on a cake",
  "Resting their chin on their hand, looking contemplative",
];

const compositionPresets = [
  "Candid, caught-off-guard shot",
  "Close-up portrait, shallow depth of field",
  "Wide shot, subject small in the frame",
  "Dutch angle for a sense of unease",
  "Shot from a low angle, looking up",
  "Over-the-shoulder perspective",
  "Reflected in a puddle or window",
  "Framed by a doorway or window",
  "Symmetrical, centered composition",
  "Messy, chaotic, 'photo dump' style",
  "Extreme close-up on an expressive detail (e.g., eyes, hands)",
  "Point-of-view (POV) shot, seeing what they see",
  "A single subject against a vast, empty landscape (negative space)",
  "Silhouette against a bright sunset or window",
  "Leading lines (roads, hallways) drawing focus to the subject",
  "A 'flat lay' of items from their perspective",
  "The subject is partially obscured by something in the foreground",
  "Shot through a prism or crystal for light effects",
  "Mirror selfie with the phone partially visible",
  "Top-down 'God's eye' view",
  "The subject is out of focus, but the background is sharp",
  "Using the 'rule of thirds' for a balanced feel",
  "A long exposure shot with light trails",
  "Panning shot with a moving subject and blurred background",
  "The subject's face is half-lit, half in shadow (chiaroscuro)",
  "Fragmented view, seen through a broken mirror or screen",
  "Unconventionally cropped, cutting off part of the subject",
  "A shot where the subject breaks the fourth wall, looking at the viewer",
  "Golden spiral composition for a natural feel",
  "A tight, intimate shot that fills the entire frame",
  "Handheld, slightly imperfect framing",
  "A shot with a very deep depth of field, everything in focus",
  // --- NEW PRESETS START HERE ---
  "Intimate close-up, cropped at the collarbones",
  "POV shot of their hands holding a book or a drink",
  "Candid shot from behind as they walk through a beautiful location",
  "Messy, authentic 'Get Ready With Me' bathroom mirror selfie",
  "Shot from the passenger seat of a car, looking at the subject",
  "Looking down at the camera, a playful and intimate angle",
  "A detail shot focusing on their shoes and interesting pavement",
  "Framed through a café window from the outside looking in",
  "Golden hour portrait with a strong, hazy lens flare",
  "A candid moment laughing genuinely, looking just off-camera",
  "Low-angle shot emphasizing a powerful, confident stance in a city",
  "A stolen moment, captured from a distance with a zoom lens",
  "The 'follow me to' pose, holding an unseen hand and leading the viewer",
  "Softly lit portrait with interesting shadows on the face (e.g., from blinds or leaves)",
  "Elevator mirror selfie with moody, dramatic lighting",
  "A candid moment of interaction with the environment (e.g., touching a flower)",
  "Blurry, energetic shot from the middle of a crowded concert or party",
  "Holding a phone up, as if vlogging directly to the audience",
  "A quiet moment, curled up with a blanket on a sofa",
  "Shot through foliage or flowers, creating a natural, soft foreground frame",
  "The subject's face is obscured or hidden by hair, a hat, or an object, creating mystery",
  "A shot capturing the subject's reflection in a shop window or sunglasses",
  "A playful 'foodstagram' shot, holding food up to the camera",
  "An intimate 'in-bed' selfie, looking relaxed and natural",
  "The 'car selfie', using the car's interior and lighting creatively",
];

const PresetInput = ({ label, name, value, placeholder, presets, onInputChange, onSelectChange }: {
  label: string;
  name: "action" | "composition" | "context";
  value: string;
  placeholder: string;
  presets: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div>
      <label htmlFor={name} className="block text-sm font-medium text-brand-text mb-1">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onInputChange}
            placeholder={placeholder}
            className="flex-1 w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
          />
          <select
              name={name}
              value=""
              onChange={onSelectChange}
              className="w-full sm:w-auto bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
              aria-label={`${label} preset`}
          >
              <option value="">-- Select Preset --</option>
              {presets.map(preset => <option key={preset} value={preset}>{preset}</option>)}
          </select>
      </div>
    </div>
);


const SceneForm: React.FC<SceneFormProps> = ({ scene, setScene, onSubmit, isLoading, isReadyToGenerate }) => {
  const handleSceneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScene(prev => ({ ...prev, [name]: value }));
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (value) {
        setScene(prev => ({ ...prev, [name]: value }));
    }
  }

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border p-4 sm:p-6 space-y-6 mt-6">
      <h2 className="text-xl font-semibold text-brand-primary">2. Scene Details</h2>

      <PresetInput
        label="Action / Pose"
        name="action"
        value={scene.action}
        placeholder="e.g., sipping coffee, looking out a window"
        presets={actionPresets}
        onInputChange={handleSceneChange}
        onSelectChange={handlePresetChange}
      />

      <PresetInput
        label="Photo Composition"
        name="composition"
        value={scene.composition}
        placeholder="e.g., close-up portrait, wide shot, candid"
        presets={compositionPresets}
        onInputChange={handleSceneChange}
        onSelectChange={handlePresetChange}
      />

      <div>
        <label htmlFor="context" className="block text-sm font-medium text-brand-text mb-1">
          Context / Fake "Social Media Caption"
        </label>
        <input
          type="text"
          id="context"
          name="context"
          value={scene.context}
          onChange={handleSceneChange}
          placeholder="e.g., 'Another rainy Tuesday.' or 'Lost in thought.'"
          className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isReadyToGenerate || isLoading}
          className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-md px-4 py-3 disabled:bg-brand-primary/50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="w-5 h-5 mr-2" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate Persona Image
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SceneForm;