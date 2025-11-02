// FIX: Implemented the BlueprintForm component to handle persona DNA and reference image inputs.
import React, { useRef } from 'react';
import { PersonaDNA } from '../types';
import PhotoIcon from './icons/PhotoIcon';
import XCircleIcon from './icons/XCircleIcon';

interface BlueprintFormProps {
  personaDNA: PersonaDNA;
  setPersonaDNA: React.Dispatch<React.SetStateAction<PersonaDNA>>;
  referenceImagePreview: string | null;
  setReferenceImage: React.Dispatch<React.SetStateAction<File | null>>;
  setReferenceImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  referenceLocationImagePreview: string | null;
  setReferenceLocationImage: React.Dispatch<React.SetStateAction<File | null>>;
  setReferenceLocationImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  referenceItemsImagePreview: string | null;
  setReferenceItemsImage: React.Dispatch<React.SetStateAction<File | null>>;
  setReferenceItemsImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const personalityPresets = [
    "Warm and inviting, like a close friend",
    "Mysterious and aloof, a bit enigmatic",
    "Chaotic good, energetic and spontaneous",
    "Soft-spoken and gentle, calming presence",
    "Witty and sarcastic, sharp-tongued humor",
    "Intellectual and thoughtful, a deep thinker",
    "Aspirational and polished, living the dream",
    "Down-to-earth and relatable, feels like a real person",
    "Bold and unapologetic, confident and outspoken",
    "Whimsical and dreamy, lost in their own world",
    "Stoic and minimalist, less is more",
    "Grungy and alternative, counter-culture vibe",
    "Bubbly and optimistic, a ray of sunshine",
    "Nostalgic and sentimental, vintage soul",
    "Adventurous and outdoorsy, a free spirit",
    "Cozy and introverted, a homebody",
    "Sleek and professional, a modern entrepreneur",
    "Artistic and eccentric, marches to their own beat",
    "Grounded and spiritual, a wellness advocate",
    "Playful and mischievous, always up to something",
    "Sarcastic Gen Z creator with a dry wit",
    "Effortlessly cool, the trendsetter",
    "Awkward but charming, the relatable nerd",
    "The calm and collected minimalist",
    "The high-energy fitness motivator",
    "The globetrotting nomad with stories to tell",
    "The introspective poet, lost in thought",
    "The sharp-witted tech reviewer",
    "The cozy gamer, streaming from their room",
    "The DIY home decor enthusiast",
    "The sarcastic foodie with a critical palate",
    "The underground music scene archivist",
    "The stoic philosopher, sharing deep insights",
    "The 'that girl' who has it all together",
    "The chaotic artist with a heart of gold",
    "The vintage fashion collector",
    "The bookworm with a massive library",
    "The plant parent with an urban jungle",
    "The street style icon, always ahead of the curve",
    "The bubbly and positive self-care advocate",
    "The adrenaline junkie seeking the next thrill",
    // --- NEW PRESETS START HERE ---
    "The 'Clean Girl' aesthetic, organized and serene",
    "Dark feminine energy, confident and mysterious",
    "Coastal grandmother, breezy and sophisticated",
    "Corp-core, finding art in the mundane office life",
    "Whimsigoth, a blend of whimsical and gothic styles",
    "The candid documentarian, capturing raw moments",
    "The luxury connoisseur, with an eye for quality",
    "The history buff, exploring ancient places",
    "The film enthusiast, always at the cinema",
    "The tech-noir detective, in a neon-lit world",
    "The friendly and approachable micro-influencer",
];

const aestheticPresets = [
    "Candid, slightly shaky iPhone photo",
    "Grainy, nostalgic 35mm film",
    "Low-quality, grainy front-camera selfie",
    "Overexposed, direct flash photography (Y2K style)",
    "Handheld 'point and shoot' digital camera look",
    "Clean, bright, and airy minimalism",
    "Dark academia, moody and intellectual",
    "Neon-drenched cyberpunk noir",
    "Soft-focus, ethereal, and dreamy",
    "High-contrast, sharp black and white",
    "Sun-drenched, golden hour glow",
    "Desaturated and cinematic, with cool tones",
    "Pastel-colored, whimsical and sweet",
    "Raw and unfiltered, 'photo dump' style",
    "Vintage polaroid with light leaks",
    "Cottagecore, rustic and romantic",
    "Lo-fi, hazy and slightly blurry",
    "Hyper-realistic, crisp and detailed",
    "Gothic and romantic, with deep shadows",
    "Vibrant and saturated, pop art inspired",
    "Muted earth tones, natural and organic",
    "Wes Anderson-esque, symmetrical and quirky",
    "Hazy & nostalgic summer memories",
    "Monochromatic with a single pop of color",
    "Accidental motion blur from a quick snap",
    "Muted, desaturated Scandi-noir tones",
    "Glimmering, ethereal fairycore lighting",
    "Rich, cinematic anamorphic look",
    "Documentary-style, fly-on-the-wall realism",
    "Faded, sun-bleached vintage postcard look",
    "Crisp, high-fashion magazine editorial",
    "Dreamy, soft-focus with a diffusion filter",
    "Cross-processed film with shifted colors",
    "Bleach bypass, high contrast and low saturation",
    "Captured through a rainy or steamy window",
    "Tungsten lighting with warm, orange tones",
    "Holographic, neon-lit iridescence",
    "Split-toned, with different colors in shadows/highlights",
    "Infrared photography look, surreal and white",
    // --- NEW PRESETS START HERE ---
    "0.5x ultra-wide angle selfie, slightly distorted",
    "Blurry, high-flash nighttime photo",
    "Vintage CCD digital camera (digicam) look",
    "Imperfect, slightly out-of-focus candid shot",
    "Lens flare from a low sun",
    "Heavy vignette, focused on the center",
    "CCTV / security camera perspective",
    "Shot on a GoPro, wide and action-oriented",
    "Disposable camera aesthetic with date stamp",
    "Halation effect, glowing highlights on film",
    "Bloom effect, soft and dreamy lighting",
];

const environmentPresets = [
    "Cozy, plant-filled apartment with lots of books",
    "Minimalist Scandinavian-style loft",
    "Rain-slicked, neon-lit Tokyo street at night",
    "Sun-drenched Mediterranean villa",
    "A quiet, misty forest trail",
    "Bustling European grand central station",
    "A vintage, wood-paneled library",
    "Sleek, modern art gallery with white walls",
    "A quirky, independent coffee shop",
    "A chaotic, paint-splattered artist's studio",
    "A moody, dimly-lit jazz bar",
    "An old, overgrown botanical garden greenhouse",
    "A vibrant, crowded Moroccan souk",
    "A serene, minimalist Japanese Zen garden",
    "A rooftop overlooking a sprawling cityscape at dusk",
    "An abandoned, ivy-covered building",
    "Inside a retro Airstream trailer on a road trip",
    "A colorful, bustling flower market",
    "A grand, empty ballroom with chandeliers",
    "A peaceful, sandy beach during the blue hour",
    "An old-school, coin-operated laundromat at night",
    "An empty, echoing subway car late at night",
    "A sun-bleached desert highway, heat haze",
    "Inside a crowded, steamy ramen shop",
    "A high-tech, minimalist gaming setup",
    "A cluttered, cozy bookstore aisle",
    "A rooftop garden overflowing with plants",
    "A gritty, graffiti-covered skatepark",
    "A grand, ornate opera house balcony",
    "A foggy, atmospheric fishing pier at dawn",
    "A packed, energetic concert crowd",
    "A sleek, futuristic airport terminal",
    "The quiet, dusty attic of an old house",
    "A retro, neon-lit bowling alley",
    "A serene, traditional Japanese onsen",
    "A bustling, chaotic fish market",
    "The driver's seat of a vintage convertible",
    "A secret, hidden garden behind a stone wall",
    "A minimalist, brutalist concrete building",
    "A vibrant, neon-lit arcade",
    "A quiet, snowy cabin in the woods",
    "An urban rooftop garden at sunset",
    "A quiet, moody Pacific Northwest beach",
    "Inside a sleek, minimalist co-working space",
    "A vibrant, bustling night market in Southeast Asia",
    "The quiet corner of a grand, historic library",
    "A rustic, charming cabin deep in the woods",
    "Historic cobblestone street in a European city",
    "A tropical beach with white sand at dawn",
    "Minimalist art studio with large windows and natural light",
    "A luxurious, modern hotel lobby",
    "An authentic, bustling Italian pizzeria kitchen",
    "A serene, misty mountaintop at sunrise",
    "An abandoned warehouse with light streaming through windows",
    "A colorful, bohemian-style living room",
    "The neon-lit interior of a futuristic bar",
    "A sun-dappled, ancient forest with mossy trees",
    "A desert landscape with dramatic rock formations",
    "Inside a vintage record store, surrounded by vinyl",
    "A grand, historic theater, empty and silent",
    "A local, family-owned bakery, early in the morning",
    // --- NEW PRESETS START HERE ---
    "A moody, rain-streaked car interior at night",
    "An aesthetic, colorful grocery store aisle",
    "A minimalist apartment with a view of New York City",
    "The interior of a cozy, private jet cabin",
    "A charming Parisian balcony with a breakfast setup",
    "A grand, sunlit staircase in a historic building",
    "An empty tennis court at golden hour",
    "Inside a sleek, modern subway station",
    "A neon-lit bodega on a city corner",
    "An old, beautiful European cathedral interior",
    "A high-end, minimalist kitchen during cooking",
];

// FIX: Moved component definition outside of BlueprintForm to prevent re-creation on re-renders.
const ImageInput = ({ label, required, preview, onInputChange, onRemove, inputRef }: {
    label: string;
    required?: boolean;
    preview: string | null;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
}) => (
    <div>
        <label className="block text-sm font-medium text-brand-text mb-1">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type="file"
            accept="image/*"
            onChange={onInputChange}
            className="hidden"
            ref={inputRef}
        />
        {preview ? (
            <div className="relative group w-full h-48 rounded-md overflow-hidden">
                <img src={preview} alt={label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                    >
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        ) : (
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full h-48 flex flex-col items-center justify-center bg-brand-bg border-2 border-dashed border-brand-border rounded-md hover:border-brand-primary transition-colors"
            >
                <PhotoIcon className="w-8 h-8 text-brand-text-muted" />
                <span className="mt-2 text-sm text-brand-text-muted">Upload Image</span>
            </button>
        )}
    </div>
);

// FIX: Moved component definition outside of BlueprintForm to prevent re-creation on re-renders.
const PresetInput = ({ label, name, value, placeholder, presets, onInputChange, onSelectChange }: {
  label: string;
  name: "personality" | "aesthetic" | "environment";
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
              value="" // Reset select to placeholder
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

const BlueprintForm: React.FC<BlueprintFormProps> = ({
  personaDNA,
  setPersonaDNA,
  referenceImagePreview,
  setReferenceImage,
  setReferenceImagePreview,
  referenceLocationImagePreview,
  setReferenceLocationImage,
  setReferenceLocationImagePreview,
  referenceItemsImagePreview,
  setReferenceItemsImage,
  setReferenceItemsImagePreview,
}) => {
  const handleDNAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonaDNA((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (value) {
        setPersonaDNA(prev => ({ ...prev, [name]: value }));
    }
  }

  const createHandleImageChange = (
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(null);
    }
    // Reset file input value to allow re-uploading the same file
    if (e.target) {
        e.target.value = '';
    }
  };

  const createHandleRemoveImage = (
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => () => {
    setImage(null);
    setPreview(null);
  };
  
  const refImageInputRef = useRef<HTMLInputElement>(null);
  const locImageInputRef = useRef<HTMLInputElement>(null);
  const itemImageInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border p-4 sm:p-6 space-y-6">
      <h2 className="text-xl font-semibold text-brand-primary">1. Persona Blueprint</h2>
      
      <PresetInput
        label="Personality / Vibe"
        name="personality"
        value={personaDNA.personality}
        placeholder="e.g., mysterious, introverted, loves vintage cameras"
        presets={personalityPresets}
        onInputChange={handleDNAChange}
        onSelectChange={handlePresetChange}
      />

      <PresetInput
        label="Aesthetic"
        name="aesthetic"
        value={personaDNA.aesthetic}
        placeholder="e.g., grainy film, neon-drenched, minimalist"
        presets={aestheticPresets}
        onInputChange={handleDNAChange}
        onSelectChange={handlePresetChange}
      />
      
      <PresetInput
        label="Primary Environment"
        name="environment"
        value={personaDNA.environment}
        placeholder="e.g., urban cityscapes, quiet forests, cozy cafes"
        presets={environmentPresets}
        onInputChange={handleDNAChange}
        onSelectChange={handlePresetChange}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageInput
              label="Reference Face/Body"
              required
              preview={referenceImagePreview}
              onInputChange={createHandleImageChange(setReferenceImage, setReferenceImagePreview)}
              onRemove={createHandleRemoveImage(setReferenceImage, setReferenceImagePreview)}
              inputRef={refImageInputRef}
          />
          <ImageInput
              label="Location"
              preview={referenceLocationImagePreview}
              onInputChange={createHandleImageChange(setReferenceLocationImage, setReferenceLocationImagePreview)}
              onRemove={createHandleRemoveImage(setReferenceLocationImage, setReferenceLocationImagePreview)}
              inputRef={locImageInputRef}
          />
          <ImageInput
              label="Items/Clothing"
              preview={referenceItemsImagePreview}
              onInputChange={createHandleImageChange(setReferenceItemsImage, setReferenceItemsImagePreview)}
              onRemove={createHandleRemoveImage(setReferenceItemsImage, setReferenceItemsImagePreview)}
              inputRef={itemImageInputRef}
          />
      </div>
    </div>
  );
};

export default BlueprintForm;