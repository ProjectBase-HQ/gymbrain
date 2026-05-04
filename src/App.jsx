import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const GOALS = [
  { id: "build_muscle", label: "Build Muscle", icon: "💪" },
  { id: "lose_fat", label: "Lose Fat", icon: "🔥" },
  { id: "strength", label: "Get Stronger", icon: "🏋️" },
  { id: "endurance", label: "Build Endurance", icon: "🏃" },
  { id: "tone", label: "Tone & Define", icon: "✨" },
  { id: "athletic", label: "Athletic Performance", icon: "⚡" },
];
const FREQ_OPTIONS = [
  { id: 2, label: "2×/week" }, { id: 3, label: "3×/week" },
  { id: 4, label: "4×/week" }, { id: 5, label: "5×/week" }, { id: 6, label: "6×/week" },
];
const DURATION_OPTIONS = [
  { id: 30, label: "30 min" }, { id: 45, label: "45 min" },
  { id: 60, label: "60 min" }, { id: 75, label: "75 min" }, { id: 90, label: "90 min" },
];
const MUSCLE_GROUPS = [
  { id: "full_body", label: "Full Body", icon: "🧍", color: "#FF6B35" },
  { id: "upper_body", label: "Upper Body", icon: "👕", color: "#FF8C42" },
  { id: "lower_body", label: "Lower Body", icon: "👖", color: "#FFB347" },
  { id: "chest", label: "Chest", icon: "🫁", color: "#E63946" },
  { id: "shoulders", label: "Shoulders", icon: "🎯", color: "#F4A261" },
  { id: "triceps", label: "Triceps", icon: "💥", color: "#E9C46A" },
  { id: "back", label: "Back", icon: "🔙", color: "#4ECDC4" },
  { id: "biceps", label: "Biceps", icon: "💪", color: "#06D6A0" },
  { id: "legs", label: "Legs", icon: "🦵", color: "#118AB2" },
  { id: "glutes", label: "Glutes", icon: "🍑", color: "#9B5DE5" },
  { id: "core", label: "Core", icon: "🔥", color: "#F15BB5" },
];
const EQUIPMENT_LIST = [
  { id: "barbell", label: "Barbell", icon: "🏋️" },
  { id: "dumbbells", label: "Dumbbells", icon: "🥊" },
  { id: "cables", label: "Cable Machine", icon: "🔌" },
  { id: "kettlebell", label: "Kettlebell", icon: "🫙" },
  { id: "plates", label: "Weight Plates", icon: "⭕" },
  { id: "landmine", label: "Landmine", icon: "📐" },
  { id: "machines", label: "Machines", icon: "🤖" },
  { id: "bodyweight", label: "Bodyweight", icon: "🧘" },
];
const ALL_EQUIPMENT_IDS = EQUIPMENT_LIST.map(e => e.id);

const MUSCLE_CATEGORIES = [
  { id: "compound", label: "Full / Compound", groups: ["full_body","upper_body","lower_body"] },
  { id: "upper", label: "Upper Body", groups: ["chest","back","shoulders","biceps","triceps"] },
  { id: "lower", label: "Lower Body", groups: ["legs","glutes"] },
  { id: "core", label: "Core", groups: ["core"] },
];

const COOLDOWN_EXERCISES = [
  { id: "cd_quad", name: "Standing Quad Stretch", duration: "30s / side", muscle: "Quads" },
  { id: "cd_hip", name: "Hip Flexor Lunge Stretch", duration: "45s / side", muscle: "Hip Flexors" },
  { id: "cd_ham", name: "Hamstring Forward Fold", duration: "30s / side", muscle: "Hamstrings" },
  { id: "cd_glute", name: "Figure-4 Glute Stretch", duration: "45s / side", muscle: "Glutes" },
  { id: "cd_chest", name: "Doorway Chest Opener", duration: "30s", muscle: "Chest & Shoulders" },
  { id: "cd_lat", name: "Child's Pose + Lat Reach", duration: "60s", muscle: "Back & Lats" },
  { id: "cd_shoulder", name: "Cross-Body Shoulder Stretch", duration: "30s / side", muscle: "Shoulders" },
  { id: "cd_calf", name: "Wall Calf Stretch", duration: "30s / side", muscle: "Calves" },
  { id: "cd_cat", name: "Cat-Cow Spinal Mobility", duration: "10 reps", muscle: "Spine" },
  { id: "cd_neck", name: "Neck Side Stretch", duration: "20s / side", muscle: "Neck" },
];

const ADD_EXERCISE_CATEGORIES = [
  { id: "cardio", label: "Cardio", icon: "🏃", source: "extra" },
  { id: "chest", label: "Chest", icon: "🫁", source: "main" },
  { id: "back", label: "Back", icon: "🔙", source: "main" },
  { id: "shoulders", label: "Shoulders", icon: "🎯", source: "main" },
  { id: "biceps", label: "Biceps", icon: "💪", source: "main" },
  { id: "triceps", label: "Triceps", icon: "💥", source: "main" },
  { id: "legs", label: "Legs", icon: "🦵", source: "main" },
  { id: "glutes", label: "Glutes", icon: "🍑", source: "main" },
  { id: "core", label: "Core", icon: "🔥", source: "main" },
  { id: "recovery", label: "Recovery", icon: "🧘", source: "extra" },
  { id: "custom", label: "Custom Exercise", icon: "✏️", source: "custom" },
];

const EXTRA_EXERCISES = [
  { id: "tmill", name: "Treadmill Run", sets: 1, reps: "30 min", rest: "—", equipment: ["machines"], muscle: "Cardio", muscleGroup: "cardio", type: "Cardio", difficulty: 2, tip: "Keep conversational pace for fat burn.", tipDetail: "", cue: "Breathe steady", equipmentLabel: "Treadmill" },
  { id: "bike", name: "Stationary Bike", sets: 1, reps: "20 min", rest: "—", equipment: ["machines"], muscle: "Cardio", muscleGroup: "cardio", type: "Cardio", difficulty: 1, tip: "Low-impact, great for active recovery post-lifting.", tipDetail: "", cue: "Keep RPM above 80", equipmentLabel: "Bike" },
  { id: "row_erg", name: "Rowing Ergometer", sets: 1, reps: "15 min", rest: "—", equipment: ["machines"], muscle: "Full Body Cardio", muscleGroup: "cardio", type: "Cardio", difficulty: 2, tip: "Drive with legs first. 60% legs, 20% back, 20% arms.", tipDetail: "", cue: "Legs, hips, arms", equipmentLabel: "Rowing Machine" },
  { id: "skip", name: "Jump Rope", sets: 5, reps: "2 min", rest: "30s", equipment: ["bodyweight"], muscle: "Cardio + Calves", muscleGroup: "cardio", type: "Cardio", difficulty: 2, tip: "Wrists spin the rope, not arms. Stay light on feet.", tipDetail: "", cue: "Stay light", equipmentLabel: "Jump Rope" },
  { id: "hiit", name: "HIIT Sprints", sets: 8, reps: "20s on/10s off", rest: "—", equipment: ["bodyweight"], muscle: "Cardio (Tabata)", muscleGroup: "cardio", type: "Cardio", difficulty: 4, tip: "True max effort — can't speak = right intensity.", tipDetail: "", cue: "Max every round", equipmentLabel: "Treadmill / Outdoor" },
  { id: "mbc", name: "Medicine Ball Slams", sets: 4, reps: "12", rest: "45s", equipment: ["machines"], muscle: "Core + Power", muscleGroup: "core", type: "Power", difficulty: 3, tip: "Full overhead extension, explosive slam.", tipDetail: "", cue: "Full extension", equipmentLabel: "Medicine Ball" },
  { id: "bxjmp", name: "Box Jump", sets: 4, reps: "8", rest: "60s", equipment: ["bodyweight"], muscle: "Quads + Power", muscleGroup: "legs", type: "Power", difficulty: 3, tip: "Land softly with bent knees. Step down — don't jump down.", tipDetail: "", cue: "Soft landing", equipmentLabel: "Plyo Box" },
  { id: "stretch", name: "Full Body Stretch", sets: 1, reps: "15 min", rest: "—", equipment: ["bodyweight"], muscle: "Recovery", muscleGroup: "recovery", type: "Recovery", difficulty: 1, tip: "Hold each stretch 30–60s. Focus hips, chest, thoracic.", tipDetail: "", cue: "Breathe into the stretch", equipmentLabel: "None" },
  { id: "foam", name: "Foam Roll + Release", sets: 1, reps: "10 min", rest: "—", equipment: ["bodyweight"], muscle: "Recovery", muscleGroup: "recovery", type: "Recovery", difficulty: 1, tip: "10–15 slow rolls per muscle. Pause on sore spots.", tipDetail: "", cue: "Slow and deliberate", equipmentLabel: "Foam Roller" },
];

// ─────────────────────────────────────────
// EXERCISE DATABASE — expanded tips + rest on all
// ─────────────────────────────────────────
const ALL_EXERCISES = {
  chest: [
    { id: "bp", name: "Flat Barbell Bench Press", sets: 4, reps: "6–8", rest: "2 min", equipment: ["barbell","plates"], muscle: "Pectoralis Major (Mid)", type: "Compound", difficulty: 3, tip: "Shoulder blades pinched, drive through legs. Bar path slightly diagonal.", tipDetail: "The bar should touch your lower chest, not your collarbone. Think about pushing yourself into the bench rather than pushing the bar up. Flared elbows = shoulder injury over time — keep them at 45°.", cue: "Chest up, elbows 45°", equipmentLabel: "Barbell + Plates" },
    { id: "idp", name: "Incline Dumbbell Press", sets: 3, reps: "8–10", rest: "90s", equipment: ["dumbbells"], muscle: "Upper Chest", type: "Compound", difficulty: 2, tip: "30–45° incline. Lower slowly, pause at stretch.", tipDetail: "Anything above 45° shifts emphasis to front delts, not chest. The stretch at the bottom is where growth happens — don't rush through it.", cue: "Feel the stretch at bottom", equipmentLabel: "Dumbbells" },
    { id: "cf", name: "Cable Chest Fly", sets: 3, reps: "12–15", rest: "60s", equipment: ["cables"], muscle: "Chest (Stretch)", type: "Isolation", difficulty: 2, tip: "Fixed elbow bend throughout. Squeeze as if hugging a barrel.", tipDetail: "Cables maintain tension throughout the full range unlike dumbbells which lose tension at the top. Set cables at mid-height for full pec stretch. Slight forward lean improves the stretch.", cue: "Hug the barrel", equipmentLabel: "Cable Machine" },
    { id: "dips", name: "Weighted Dips", sets: 3, reps: "8–10", rest: "90s", equipment: ["bodyweight"], muscle: "Lower Chest + Triceps", type: "Compound", difficulty: 3, tip: "Lean torso forward 15–20° to bias chest.", tipDetail: "Upright torso = tricep dips. Lean forward = chest dips. The difference is significant. Aim to feel a deep stretch in your lower pec at the bottom of each rep.", cue: "Lean forward slightly", equipmentLabel: "Dip Bar" },
    { id: "dfp", name: "Decline Dumbbell Fly", sets: 3, reps: "12", rest: "60s", equipment: ["dumbbells"], muscle: "Lower Chest", type: "Isolation", difficulty: 2, tip: "Full stretch at bottom. Don't touch at top — keep tension.", tipDetail: "", cue: "Control the arc", equipmentLabel: "Dumbbells" },
    { id: "pu", name: "Push-Up Burnout", sets: 2, reps: "Max", rest: "60s", equipment: ["bodyweight"], muscle: "Full Chest", type: "Bodyweight", difficulty: 1, tip: "Chest to floor, fully lock out. Slow on the way down.", tipDetail: "Add a 3-second eccentric (lowering phase) to dramatically increase difficulty and muscle activation. Keep your core tight throughout — don't let your hips sag.", cue: "Slow negatives for max pump", equipmentLabel: "Bodyweight" },
    { id: "pec_deck", name: "Pec Deck Machine Fly", sets: 3, reps: "12–15", rest: "60s", equipment: ["machines"], muscle: "Chest (Contraction)", type: "Isolation", difficulty: 1, tip: "Elbows at shoulder height. Full squeeze at centre.", tipDetail: "", cue: "Squeeze at peak", equipmentLabel: "Pec Deck Machine" },
  ],
  back: [
    { id: "dl", name: "Conventional Deadlift", sets: 4, reps: "4–6", rest: "3 min", equipment: ["barbell","plates"], muscle: "Full Posterior Chain", type: "Compound", difficulty: 4, tip: "Bar over mid-foot, hinge at hips, neutral spine. Lock lats before pulling.", tipDetail: "Before pulling, take a big breath and brace your core like someone's about to punch you. The lats should be 'protecting your armpits' — this prevents your back rounding under load. Think push the floor away, not pull the bar up.", cue: "Push the floor away", equipmentLabel: "Barbell + Plates" },
    { id: "pup", name: "Pull-Ups", sets: 4, reps: "6–8", rest: "2 min", equipment: ["bodyweight"], muscle: "Lats + Biceps", type: "Compound", difficulty: 4, tip: "Depress scapula before pulling. Elbows drive down into pockets.", tipDetail: "Most people skip the dead hang — starting from a full stretch with active shoulder blades (packed down) is where real lat development comes from. Avoid kipping unless training for sport.", cue: "Elbows to hips", equipmentLabel: "Pull-Up Bar" },
    { id: "cr", name: "Seated Cable Row", sets: 3, reps: "10–12", rest: "75s", equipment: ["cables"], muscle: "Mid Back + Rhomboids", type: "Compound", difficulty: 2, tip: "Chest to pad. Row to lower chest. Pause and squeeze.", tipDetail: "The pause at the contracted position (elbows back, chest tall) is where mid-back development happens. Rushing through kills the stimulus. Think about squeezing a pencil between your shoulder blades.", cue: "Chest proud, elbows tight", equipmentLabel: "Cable Machine" },
    { id: "dbr", name: "Single-Arm DB Row", sets: 3, reps: "10–12", rest: "60s", equipment: ["dumbbells"], muscle: "Lats + Rear Delt", type: "Compound", difficulty: 2, tip: "Full stretch at bottom, elbow drives up past hip.", tipDetail: "", cue: "Elbow to sky", equipmentLabel: "Dumbbell" },
    { id: "fp", name: "Face Pulls", sets: 3, reps: "15–20", rest: "60s", equipment: ["cables"], muscle: "Rear Delts + Rotator Cuff", type: "Isolation", difficulty: 1, tip: "Pull to forehead, rotate thumbs back at end range.", tipDetail: "This exercise fixes shoulder health and prevents internal rotation imbalances. Set the cable at eye height or above. The thumbs-back rotation at end range is the key cue — most people skip it.", cue: "Double bicep at end", equipmentLabel: "Cable Machine" },
    { id: "lpd", name: "Lat Pulldown", sets: 3, reps: "10–12", rest: "75s", equipment: ["cables","machines"], muscle: "Lats (Width)", type: "Compound", difficulty: 2, tip: "Lean back slightly, pull to upper chest. Stretch arms at top.", tipDetail: "The stretch at the top (full arm extension) is what builds lat width. Don't shortcut the range. Slight lean back of 10–15° is enough — don't turn this into a row.", cue: "Chest to bar", equipmentLabel: "Cable / Lat Machine" },
    { id: "bb_row", name: "Barbell Bent Over Row", sets: 4, reps: "6–8", rest: "2 min", equipment: ["barbell","plates"], muscle: "Mid Back + Lats", type: "Compound", difficulty: 3, tip: "Hinge 45°, bar to belly button. Overhand = rhomboids. Underhand = lats.", tipDetail: "Overhand (pronated) grip targets rhomboids and upper back. Underhand (supinated) grip shifts emphasis to lower lats and biceps. Both are valuable — alternate between sessions.", cue: "Bar to belly button", equipmentLabel: "Barbell + Plates" },
    { id: "kb_row", name: "Kettlebell Row", sets: 3, reps: "10/arm", rest: "60s", equipment: ["kettlebell"], muscle: "Lats + Mid Back", type: "Compound", difficulty: 2, tip: "Same mechanics as DB row. Neutral spine, full stretch.", tipDetail: "", cue: "Elbow to ceiling", equipmentLabel: "Kettlebell" },
  ],
  legs: [
    { id: "sq", name: "Barbell Back Squat", sets: 4, reps: "5–8", rest: "3 min", equipment: ["barbell","plates"], muscle: "Quads + Glutes + Hamstrings", type: "Compound", difficulty: 4, tip: "Break at hips and knees simultaneously. Knees track toes.", tipDetail: "High bar position = more quad-dominant. Low bar position = more hip/glute-dominant. Both are valid. The cue 'spread the floor' means actively push your knees out as you descend — this protects the knee joint and activates more glute.", cue: "Spread the floor apart", equipmentLabel: "Barbell + Plates" },
    { id: "rdl", name: "Romanian Deadlift", sets: 3, reps: "8–10", rest: "2 min", equipment: ["barbell","dumbbells"], muscle: "Hamstrings + Glutes", type: "Compound", difficulty: 3, tip: "Soft knee bend, push hips back, bar drags down leg.", tipDetail: "The deeper the hip hinge, the more hamstring stretch you achieve. Most people stop too early. You should feel a significant hamstring pull around mid-shin level. Keep the bar within 2cm of your legs throughout.", cue: "Hinge, don't squat", equipmentLabel: "Barbell or Dumbbells" },
    { id: "lp", name: "Leg Press", sets: 3, reps: "10–12", rest: "90s", equipment: ["machines"], muscle: "Quads + Glutes", type: "Compound", difficulty: 2, tip: "High foot = glutes. Low = quads. Never lock out knees.", tipDetail: "Foot position dramatically changes muscle emphasis:\n• High + wide foot placement → glutes & hamstrings\n• Low + narrow foot placement → quads (vastus lateralis)\n• Mid + shoulder-width → balanced quads & glutes\n• Toes pointed out → inner quads (VMO) + inner glutes\nNever fully lock out — always keep a slight bend to protect the knee joint.", cue: "Foot position matters", equipmentLabel: "Leg Press Machine" },
    { id: "lunge", name: "Bulgarian Split Squat", sets: 3, reps: "8–10/leg", rest: "90s", equipment: ["dumbbells","bodyweight"], muscle: "Quads + Glutes (Unilateral)", type: "Compound", difficulty: 3, tip: "Rear foot elevated. Torso slightly forward. Drive through front heel.", tipDetail: "Torso upright = quad dominant. Slight forward lean = glute dominant. The stretch in the hip flexor of the back leg also improves mobility. This is one of the most effective single-leg exercises — embrace the difficulty.", cue: "Hips drop straight down", equipmentLabel: "Dumbbells / Bodyweight" },
    { id: "lc", name: "Leg Curl Machine", sets: 3, reps: "12–15", rest: "60s", equipment: ["machines"], muscle: "Hamstrings (Isolated)", type: "Isolation", difficulty: 1, tip: "Foot slightly dorsiflexed. Pause at peak. Slow eccentric.", tipDetail: "Dorsiflexing your foot (pulling toes up) stretches the gastrocnemius and allows the hamstrings to contract harder. The slow eccentric (lowering phase) is where most hamstring development occurs — take 3 seconds to lower.", cue: "Point toes for more stretch", equipmentLabel: "Leg Curl Machine" },
    { id: "le", name: "Leg Extension", sets: 3, reps: "15", rest: "60s", equipment: ["machines"], muscle: "Quads (Isolated)", type: "Isolation", difficulty: 1, tip: "Lean back slightly. Full lock at top.", tipDetail: "Leaning back in the seat increases the stretch on the rectus femoris (the longest quad muscle). The full lockout at the top is important — holding that squeeze for 1 second dramatically increases quad activation.", cue: "Squeeze at lockout", equipmentLabel: "Leg Extension Machine" },
    { id: "cr2", name: "Calf Raises", sets: 4, reps: "20–25", rest: "45s", equipment: ["machines","bodyweight"], muscle: "Gastrocnemius + Soleus", type: "Isolation", difficulty: 1, tip: "Full heel drop. Full rise. Pause 1s at top.", tipDetail: "Calves are notoriously stubborn because they're built for endurance — high rep ranges (20+) and full range of motion are essential. Seated calf raises target the soleus (the deeper muscle). Standing targets the gastrocnemius more.", cue: "Full range always", equipmentLabel: "Machine or Bodyweight" },
    { id: "kb_goblet", name: "Goblet Squat", sets: 3, reps: "12", rest: "75s", equipment: ["kettlebell","dumbbells"], muscle: "Quads + Core", type: "Compound", difficulty: 2, tip: "Hold at chest. Chest tall, elbows track knees.", tipDetail: "", cue: "Chest up, knees out", equipmentLabel: "Kettlebell or Dumbbell" },
  ],
  glutes: [
    { id: "hbt", name: "Barbell Hip Thrust", sets: 4, reps: "8–12", rest: "90s", equipment: ["barbell","plates"], muscle: "Glutes (Primary)", type: "Compound", difficulty: 3, tip: "Bench at shoulder blades. Drive hips to ceiling, pelvic tilt at top.", tipDetail: "The posterior pelvic tilt at the top (tucking the pelvis) is the key to full glute contraction. Without it, you're shortchanging the exercise. Feet should be far enough out that shins are vertical at the top position.", cue: "Squeeze hard at top", equipmentLabel: "Barbell + Plates" },
    { id: "kbsw", name: "Kettlebell Swing", sets: 4, reps: "15–20", rest: "60s", equipment: ["kettlebell"], muscle: "Glutes + Hamstrings + Core", type: "Power", difficulty: 3, tip: "Hip hinge — not a squat. Snap hips forward explosively.", tipDetail: "The swing is a ballistic hip hinge, not a squat. The bell should float at the top due to hip extension power, not arm lifting. Keep arms loose — they just guide the bell. At the top, your body should form a straight plank. The weight is driven by your hips, not your shoulders.", cue: "Hinge and snap", equipmentLabel: "Kettlebell" },
    { id: "ckg", name: "Cable Kickback", sets: 3, reps: "15/leg", rest: "45s", equipment: ["cables"], muscle: "Glutes (Isolation)", type: "Isolation", difficulty: 1, tip: "Flex at top, hold 1s. Slight forward lean.", tipDetail: "", cue: "Glute squeeze at extension", equipmentLabel: "Cable Machine" },
    { id: "sbss", name: "Sumo Deadlift", sets: 3, reps: "6–8", rest: "2 min", equipment: ["barbell","plates"], muscle: "Glutes + Inner Thighs", type: "Compound", difficulty: 3, tip: "Wide stance, toes out 45°. Pull the floor apart.", tipDetail: "The wide stance and external toe rotation puts your hips in a position to bias the glutes and inner thighs (adductors) more than a conventional deadlift. 'Pull the floor apart' means actively pushing your knees out in line with your toes throughout the pull.", cue: "Push knees out", equipmentLabel: "Barbell + Plates" },
    { id: "gbr", name: "Glute Bridge (Banded)", sets: 3, reps: "15–20", rest: "60s", equipment: ["bodyweight"], muscle: "Glutes + Hamstrings", type: "Isolation", difficulty: 1, tip: "Band above knees, push knees out. 2s hold at top.", tipDetail: "The band adds abduction resistance which activates the gluteus medius (side glute) in addition to the gluteus maximus. Feet should be close enough to the body that shins are near-vertical at the top.", cue: "Push through heels", equipmentLabel: "Bodyweight" },
    { id: "dbell_hip", name: "Dumbbell Hip Thrust", sets: 4, reps: "10–12", rest: "75s", equipment: ["dumbbells"], muscle: "Glutes (Primary)", type: "Compound", difficulty: 2, tip: "Dumbbell on hip. Same mechanics as barbell version.", tipDetail: "", cue: "Drive hips to ceiling", equipmentLabel: "Dumbbell" },
  ],
  shoulders: [
    { id: "ohp", name: "Seated DB Overhead Press", sets: 4, reps: "8–10", rest: "90s", equipment: ["dumbbells"], muscle: "All 3 Delt Heads", type: "Compound", difficulty: 3, tip: "Neutral grip start. Press to lockout, slightly in front of ears.", tipDetail: "Pressing slightly in front of your ears (not directly overhead) maintains a more natural shoulder-joint angle. Neutral grip at the start and rotating to pronated (palms forward) as you press is the Arnold variation — great for complete delt development.", cue: "Press up and slightly back", equipmentLabel: "Dumbbells" },
    { id: "lr", name: "Lateral Raises", sets: 4, reps: "15–20", rest: "60s", equipment: ["dumbbells","cables"], muscle: "Medial Delt", type: "Isolation", difficulty: 2, tip: "Lead with elbow. Thumb slightly down. Slight forward lean.", tipDetail: "The medial (middle) delt is what gives shoulders width. Thumb-down ('pouring the jug') externally rotates the shoulder and better isolates the medial head. Stop at parallel — going higher turns it into a trap exercise.", cue: "Pour the jug", equipmentLabel: "Dumbbells or Cables" },
    { id: "ap", name: "Arnold Press", sets: 3, reps: "10", rest: "75s", equipment: ["dumbbells"], muscle: "All Delts + Rotator Cuff", type: "Compound", difficulty: 3, tip: "Start palms facing you, rotate out as you press.", tipDetail: "The rotation through the full range of motion hits all three delt heads in a single movement. Start with palms facing your face (front delt emphasis), rotate to palms facing forward as you press up. The rotator cuff gets significant stabilization work throughout.", cue: "Rotate through the press", equipmentLabel: "Dumbbells" },
    { id: "upr", name: "Upright Row (Cable)", sets: 3, reps: "12", rest: "60s", equipment: ["cables","barbell"], muscle: "Medial Delt + Traps", type: "Compound", difficulty: 2, tip: "Wide grip, elbows lead above wrists. Never above ear.", tipDetail: "", cue: "Elbows above wrists", equipmentLabel: "Cable or Barbell" },
    { id: "rfp", name: "Rear Delt Fly", sets: 3, reps: "15", rest: "60s", equipment: ["dumbbells","cables"], muscle: "Rear Delt", type: "Isolation", difficulty: 2, tip: "Hinge to parallel. Slight bend in elbows. Lead elbows, not hands.", tipDetail: "Most people neglect rear delts, creating shoulder imbalances that lead to poor posture and injury. Hinging forward to parallel ensures gravity is working against the rear delt through the full range. Lead the movement with your elbows, not your hands.", cue: "Elbows wide, not back", equipmentLabel: "Dumbbells or Cables" },
    { id: "bb_ohp", name: "Barbell Overhead Press", sets: 4, reps: "6–8", rest: "2 min", equipment: ["barbell","plates"], muscle: "Front + Medial Delt", type: "Compound", difficulty: 3, tip: "Bar at upper chest. Press straight up, head slightly back.", tipDetail: "", cue: "Push your head through", equipmentLabel: "Barbell + Plates" },
  ],
  biceps: [
    { id: "bbc", name: "Barbell Curl", sets: 4, reps: "8–10", rest: "75s", equipment: ["barbell","plates"], muscle: "Biceps (Full)", type: "Isolation", difficulty: 2, tip: "Full supination at top, full stretch at bottom. No swing.", tipDetail: "Supination (rotating the wrist so palm faces up/ceiling) at the top is what makes curls effective — it's the bicep's primary function. The stretch at the bottom is equally important. Swinging uses momentum instead of muscle.", cue: "Supinate at peak", equipmentLabel: "Barbell" },
    { id: "hc", name: "Incline Dumbbell Curl", sets: 3, reps: "10–12", rest: "60s", equipment: ["dumbbells"], muscle: "Biceps Long Head", type: "Isolation", difficulty: 2, tip: "Bench at 45–60°, arms hang back. Max stretch = max growth.", tipDetail: "The long head (outer bicep) creates the peak. The incline position stretches the long head at its origin point (the shoulder) which is essential for developing that peak. Let the arm hang fully behind you before curling.", cue: "Let them stretch fully", equipmentLabel: "Dumbbells + Bench" },
    { id: "hamc", name: "Hammer Curl", sets: 3, reps: "12", rest: "60s", equipment: ["dumbbells"], muscle: "Brachialis + Brachioradialis", type: "Isolation", difficulty: 1, tip: "Neutral grip, alternating. Creates arm thickness.", tipDetail: "The brachialis sits underneath the bicep and pushing it up creates arm thickness (the 'gorilla arm' look). Hammer curls also train the brachioradialis forearm muscle which contributes to overall arm size.", cue: "Build arm thickness", equipmentLabel: "Dumbbells" },
    { id: "cc", name: "Cable Curl (Single Arm)", sets: 3, reps: "12–15", rest: "60s", equipment: ["cables"], muscle: "Biceps (Constant Tension)", type: "Isolation", difficulty: 1, tip: "Cable tension at full extension. Supinate at top.", tipDetail: "", cue: "Tension through full range", equipmentLabel: "Cable Machine" },
    { id: "pc", name: "Preacher Curl", sets: 3, reps: "10", rest: "75s", equipment: ["machines","barbell"], muscle: "Biceps Short Head", type: "Isolation", difficulty: 2, tip: "Slow eccentric, don't fully lock out.", tipDetail: "The short head (inner bicep) gives bicep width and fullness. The preacher bench locks out the upper arm, eliminating cheating. Don't lock out at the bottom — maintaining tension protects the elbow joint.", cue: "Don't lock out", equipmentLabel: "Preacher Bench" },
    { id: "kb_curl", name: "Kettlebell Curl", sets: 3, reps: "12", rest: "60s", equipment: ["kettlebell"], muscle: "Biceps", type: "Isolation", difficulty: 1, tip: "Neutral grip. Offset weight challenges stabilisers.", tipDetail: "", cue: "Supinate at top", equipmentLabel: "Kettlebell" },
  ],
  triceps: [
    { id: "sc", name: "Skull Crushers (EZ Bar)", sets: 4, reps: "10", rest: "75s", equipment: ["barbell","plates"], muscle: "Triceps Long Head", type: "Isolation", difficulty: 3, tip: "Lower to forehead, elbows slightly back. Don't flare.", tipDetail: "The long head (the biggest portion of the tricep) is best developed in the stretched position — overhead or with the upper arm behind the head. Skull crushers achieve this because the upper arm angles slightly back as you lower. Don't flare the elbows out or you lose tension on the long head.", cue: "Elbows stay put", equipmentLabel: "EZ Bar / Barbell" },
    { id: "tpd", name: "Tricep Rope Pushdown", sets: 3, reps: "12–15", rest: "60s", equipment: ["cables"], muscle: "Triceps Lateral Head", type: "Isolation", difficulty: 1, tip: "Flare rope at bottom for full contraction. Elbows pinned.", tipDetail: "The lateral head (outer tricep) gives the horseshoe shape. Flaring the rope out at the bottom of the movement forces full elbow extension and maximises lateral head contraction. Elbows must stay pinned to your sides throughout.", cue: "Flare at bottom", equipmentLabel: "Cable + Rope" },
    { id: "cgb", name: "Close-Grip Bench Press", sets: 4, reps: "8–10", rest: "90s", equipment: ["barbell","plates"], muscle: "Triceps + Inner Chest", type: "Compound", difficulty: 3, tip: "Shoulder-width grip. Elbows 45° to torso.", tipDetail: "Shoulder-width grip — not too close or wrist strain develops. The 45° elbow angle (not fully tucked, not fully flared) optimises tricep loading while protecting the shoulder joint.", cue: "Elbows at 45°", equipmentLabel: "Barbell + Plates" },
    { id: "ohte", name: "Overhead Tricep Extension", sets: 3, reps: "12", rest: "60s", equipment: ["dumbbells","cables"], muscle: "Triceps Long Head (Stretch)", type: "Isolation", difficulty: 2, tip: "Overhead stretches long head most. Control descent.", tipDetail: "This is the best exercise for the long head because it's the only head that crosses the shoulder joint — putting the arm overhead stretches it fully, enabling maximum recruitment. The controlled descent (eccentric) is where most growth stimulus comes from.", cue: "Maximize the stretch", equipmentLabel: "Dumbbell or Cable" },
    { id: "dkb", name: "Diamond Push-Up", sets: 3, reps: "Max", rest: "60s", equipment: ["bodyweight"], muscle: "Triceps + Inner Chest", type: "Bodyweight", difficulty: 2, tip: "Hands form diamond, elbows track straight back.", tipDetail: "", cue: "Track elbows back", equipmentLabel: "Bodyweight" },
    { id: "kb_tri", name: "Kettlebell Overhead Extension", sets: 3, reps: "12", rest: "60s", equipment: ["kettlebell"], muscle: "Triceps Long Head", type: "Isolation", difficulty: 2, tip: "Hold KB with both hands overhead. Lower behind head slowly.", tipDetail: "", cue: "Elbows close to ears", equipmentLabel: "Kettlebell" },
  ],
  core: [
    { id: "crc", name: "Cable Crunch", sets: 4, reps: "15–20", rest: "60s", equipment: ["cables"], muscle: "Upper Abs", type: "Isolation", difficulty: 2, tip: "Kneel, pull to knees. Crunch rib to hip.", tipDetail: "The key cue is 'rib to hip' — you're crunching your torso, not pulling the weight down with your arms. Keep hands stationary at your forehead and flex your abs to bring rib cage toward hips.", cue: "Rib to hip, not head to knees", equipmentLabel: "Cable Machine" },
    { id: "hr", name: "Hanging Leg Raise", sets: 3, reps: "12–15", rest: "60s", equipment: ["bodyweight"], muscle: "Lower Abs + Hip Flexors", type: "Compound", difficulty: 3, tip: "Posterior pelvic tilt at top — curl tailbone up.", tipDetail: "", cue: "Curl the tailbone", equipmentLabel: "Pull-Up Bar" },
    { id: "pp", name: "Pallof Press", sets: 3, reps: "12/side", rest: "60s", equipment: ["cables"], muscle: "Anti-Rotation Core", type: "Anti-Rotation", difficulty: 2, tip: "Press out, hold 2s, return. Fight the rotation.", tipDetail: "The Pallof press trains anti-rotation — your core's most important real-world function. The cable tries to rotate you; your job is to resist it completely. Stand far enough from the cable that you feel significant pull.", cue: "Don't twist", equipmentLabel: "Cable Machine" },
    { id: "awr", name: "Ab Wheel Rollout", sets: 3, reps: "10–12", rest: "75s", equipment: ["bodyweight"], muscle: "Full Core", type: "Compound", difficulty: 4, tip: "Hollow body position. Don't let hips sag.", tipDetail: "This is one of the most demanding core exercises. The hollow body position means posterior pelvic tilt, ribs pulled down, abs engaged before you even start moving. Hips sagging = lower back loading = injury. Pull with your lats to return.", cue: "Hollow body always", equipmentLabel: "Ab Wheel" },
    { id: "db_bug", name: "Dead Bug", sets: 3, reps: "10/side", rest: "60s", equipment: ["bodyweight"], muscle: "Deep Core Stabilisers", type: "Stability", difficulty: 2, tip: "Lower back flat throughout. Breathe out as you extend.", tipDetail: "", cue: "Back flat, always", equipmentLabel: "Bodyweight" },
    { id: "plnk", name: "RKC Plank", sets: 3, reps: "30–45s", rest: "45s", equipment: ["bodyweight"], muscle: "Full Core + Glutes", type: "Isometric", difficulty: 2, tip: "Squeeze everything — glutes, abs, elbows to toes.", tipDetail: "The RKC plank (Russian Kettlebell Challenge plank) generates 300% more core activation than a standard plank. Pull your elbows toward your toes while squeezing your glutes and abs maximally. Hold for 30s max — if you can hold it longer, you're not squeezing hard enough.", cue: "Squeeze everything", equipmentLabel: "Bodyweight" },
    { id: "landmine_rot", name: "Landmine Rotations", sets: 3, reps: "12/side", rest: "60s", equipment: ["landmine","barbell"], muscle: "Obliques + Rotational Core", type: "Compound", difficulty: 3, tip: "Rotate from core — not arms. Powerful arc.", tipDetail: "", cue: "Rotate from hips", equipmentLabel: "Landmine + Barbell" },
  ],
};

const GROUP_TO_MUSCLES = {
  full_body: ["chest","back","shoulders","legs","core"],
  upper_body: ["chest","back","shoulders","biceps","triceps"],
  lower_body: ["legs","glutes"],
  chest: ["chest"], shoulders: ["shoulders"], triceps: ["triceps"],
  back: ["back"], biceps: ["biceps"], legs: ["legs"], glutes: ["glutes"], core: ["core"],
};

// ─────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────
const getExercisesForMuscles = (muscleIds, equipment, duration) => {
  const allEq = equipment || [];
  const hasEq = (ex) => ex.equipment.some(e => allEq.includes(e) || e === "bodyweight");
  let result = [];
  muscleIds.forEach(m => {
    const pool = (ALL_EXERCISES[m] || []).filter(ex => allEq.length === 0 || hasEq(ex));
    const count = duration <= 30 ? 3 : duration <= 45 ? 4 : duration <= 60 ? 5 : 6;
    const sorted = [...pool].sort((a,b) => b.difficulty - a.difficulty);
    result.push(...sorted.slice(0, Math.ceil(count / muscleIds.length) + 1).map(e => ({ ...e, muscleGroup: m })));
  });
  const seen = new Set();
  return result.filter(e => { if(seen.has(e.id)) return false; seen.add(e.id); return true; })
    .slice(0, duration <= 30 ? 4 : duration <= 45 ? 6 : duration <= 60 ? 8 : 10);
};

const saveData = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} };
const loadData = (key, fb) => { try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fb; } catch(e) { return fb; } };
const today = () => new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "short", day: "numeric" });
const dayOfWeek = () => new Date().toLocaleDateString("en-GB", { weekday: "long" });
const timeGreeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

const exportToCSV = (history, userName) => {
  const rows = [["Date","Session","Exercise","Muscle Group","Sets Done","Reps","Weights (kg)","Duration (min)"]];
  history.forEach(h => {
    if (h.exercise_details && h.exercise_details.length > 0) {
      h.exercise_details.forEach(ex => {
        const weights = ex.weights ? ex.weights.filter(w => w).join(" / ") : "";
        rows.push([h.date, h.label, ex.name, ex.muscle || ex.muscleGroup || "", ex.setsCompleted || "", ex.reps || "", weights, h.duration || ""]);
      });
    } else {
      rows.push([h.date, h.label, "", "", h.sets || "", "", "", h.duration || ""]);
    }
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `GymBrain_${userName}_Progress.csv`; a.click();
  URL.revokeObjectURL(url);
};

function parseRestSeconds(restStr) {
  if (!restStr || restStr === "—") return 60;
  const s = String(restStr).toLowerCase().trim();
  if (s.includes("min")) { const m = parseFloat(s); return isNaN(m) ? 60 : Math.round(m * 60); }
  const n = parseInt(s);
  return isNaN(n) ? 60 : n;
}

// Get last used sets/reps for an exercise id from prefs store
const getExPref = (exId) => loadData(`pref_${exId}`, null);
const saveExPref = (exId, sets, reps) => saveData(`pref_${exId}`, { sets, reps });

// Favourites helpers
const getFavourites = () => loadData("gymbrain_favourites", []);
const toggleFavourite = (exId) => {
  const favs = getFavourites();
  const next = favs.includes(exId) ? favs.filter(f => f !== exId) : [...favs, exId];
  saveData("gymbrain_favourites", next);
  return next;
};

// ─────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────
const Chip = ({ label, icon, selected, onClick, color = "#FF6B35", small = false }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: small ? "7px 14px" : "10px 18px",
    borderRadius: 50, border: selected ? `2px solid ${color}` : "2px solid #222",
    background: selected ? `${color}18` : "#111",
    color: selected ? color : "#666",
    fontSize: small ? 12 : 13, fontFamily: "'DM Sans', sans-serif", fontWeight: selected ? 600 : 400,
    cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
  }}>
    {icon && <span style={{ fontSize: small ? 14 : 16 }}>{icon}</span>}
    {label}
  </button>
);

const Tag = ({ label, color = "#FF6B35" }) => (
  <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: `${color}22`, color, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
    {label}
  </span>
);

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 18px" }}>
    <div style={{ flex: 1, height: 1, background: "#1A1A1A" }} />
    <span style={{ fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase" }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: "#1A1A1A" }} />
  </div>
);

const ProgressBar = ({ value, color = "#FF6B35" }) => (
  <div style={{ height: 4, background: "#1A1A1A", borderRadius: 2, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
  </div>
);

// ─────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────
function OnboardingScreen({ onComplete, existingUser }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(existingUser ? {
    name: existingUser.name, age: existingUser.age, gender: existingUser.gender,
    goals: existingUser.goals || [], freq: existingUser.freq || null, duration: existingUser.duration || null,
  } : { name: "", age: "", gender: "", goals: [], freq: null, duration: null });
  const inputRef = useRef();
  const isEdit = !!existingUser;
  useEffect(() => { if (!isEdit && step === 0 && inputRef.current) inputRef.current.focus(); }, [step]);
  const toggleArr = (field, val) => setForm(f => ({ ...f, [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val] }));

  const allSteps = [
    {
      title: "Welcome to GymBrain", sub: "Set up your profile in under a minute.",
      canNext: form.name.trim().length > 1 && form.age.length > 0,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input ref={inputRef} placeholder="Your first name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} style={inputStyle} />
          <input placeholder="Age" type="number" min="13" max="80" value={form.age} onChange={e => setForm(f => ({...f, age: e.target.value}))} style={inputStyle} />
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {["Male","Female","Other"].map(g => <Chip key={g} label={g} selected={form.gender === g} onClick={() => setForm(f => ({...f, gender: g}))} />)}
          </div>
        </div>
      )
    },
    {
      title: isEdit ? "Update your goals" : `What's your goal, ${form.name || "champ"}?`,
      sub: "Pick all that apply. Update anytime.",
      canNext: form.goals.length > 0,
      content: <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{GOALS.map(g => <Chip key={g.id} label={g.label} icon={g.icon} selected={form.goals.includes(g.id)} onClick={() => toggleArr("goals", g.id)} />)}</div>
    },
    {
      title: "Your schedule", sub: "Be realistic — consistency beats intensity.",
      canNext: !!(form.freq && form.duration),
      content: (
        <div>
          <div style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Days per week?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            {FREQ_OPTIONS.map(f => <Chip key={f.id} label={f.label} selected={form.freq === f.id} onClick={() => setForm(fr => ({...fr, freq: f.id}))} />)}
          </div>
          <div style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Session length?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {DURATION_OPTIONS.map(d => <Chip key={d.id} label={d.label} selected={form.duration === d.id} onClick={() => setForm(f => ({...f, duration: d.id}))} />)}
          </div>
        </div>
      )
    },
  ];
  const steps = isEdit ? allSteps.slice(1) : allSteps;
  const current = steps[step];

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "48px 20px 60px" }}>
      {isEdit && <div style={{ fontSize: 11, color: "#555", letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>Editing: <span style={{ color: "#FF6B35" }}>{existingUser.name}</span></div>}
      <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
        {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? "#FF6B35" : "#1A1A1A", transition: "background 0.3s" }} />)}
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, lineHeight: 1.1, marginBottom: 8, letterSpacing: 1 }}>{current.title}</div>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 32, lineHeight: 1.6 }}>{current.sub}</div>
      {current.content}
      <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
        {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ ...btnStyle, background: "#1A1A1A", color: "#888", flex: "0 0 auto", width: 48 }}>←</button>}
        <button onClick={() => { if (step < steps.length - 1) setStep(s => s + 1); else onComplete({ ...form, ...(isEdit ? { id: existingUser.id } : {}) }); }}
          disabled={!current.canNext} style={{ ...btnStyle, flex: 1, opacity: current.canNext ? 1 : 0.4 }}>
          {step < steps.length - 1 ? "Continue →" : isEdit ? "Save Changes ✓" : `Let's Go, ${form.name}! 🔥`}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// USER SELECT
// ─────────────────────────────────────────
function UserSelectScreen({ users, onSelect, onNew, onRemove }) {
  const [confirmRemove, setConfirmRemove] = useState(null);
  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "48px 20px" }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 2, marginBottom: 6 }}>GYM<span style={{ color: "#FF6B35" }}>BRAIN</span></div>
      <div style={{ width: 40, height: 3, background: "#FF6B35", marginBottom: 36 }} />
      <div style={{ fontSize: 13, color: "#666", marginBottom: 28 }}>Who's training today?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {users.map(u => (
          <div key={u.id}>
            {confirmRemove === u.id ? (
              <div style={{ background: "#1A0A0A", border: "1px solid #E6394644", borderRadius: 16, padding: "16px 20px" }}>
                <div style={{ fontSize: 14, color: "#F0F0F0", marginBottom: 4 }}>Remove <span style={{ color: "#E63946", fontWeight: 600 }}>{u.name}</span>?</div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>This will permanently delete their profile and all workout history.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { onRemove(u.id); setConfirmRemove(null); }} style={{ ...smallBtnStyle, flex: 1, color: "#E63946", borderColor: "#E63946" }}>Yes, Remove</button>
                  <button onClick={() => setConfirmRemove(null)} style={{ ...smallBtnStyle, flex: 1 }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <button onClick={() => onSelect(u)} style={{ flex: 1, background: "#141414", border: "1px solid #1E1E1E", borderRight: "none", borderRadius: "16px 0 0 16px", padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left", transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#1E1E1E"}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#0A0A0A", flexShrink: 0 }}>{u.name[0].toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#F0F0F0", marginBottom: 3 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#555" }}>{u.goals.map(g => GOALS.find(x=>x.id===g)?.icon).join(" ")} · {u.freq}×/week · {u.duration}min</div>
                  </div>
                  <span style={{ color: "#FF6B35", fontSize: 18 }}>→</span>
                </button>
                <button onClick={() => setConfirmRemove(u.id)} style={{ background: "#141414", border: "1px solid #1E1E1E", borderRadius: "0 16px 16px 0", padding: "0 16px", cursor: "pointer", color: "#444", fontSize: 16, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#E63946"; e.currentTarget.style.borderColor = "#E63946"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#444"; e.currentTarget.style.borderColor = "#1E1E1E"; }}>✕</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={onNew} style={{ ...btnStyle, background: "#1A1A1A", color: "#888", width: "100%" }}>+ Add New Profile</button>
    </div>
  );
}

// ─────────────────────────────────────────
// HOME
// ─────────────────────────────────────────
function HomeScreen({ user, onWorkout, onHistory, onEditProfile, onSwitchUser }) {
  const history = loadData(`history_${user.id}`, []);
  const lastSession = history[history.length - 1];
  const weekSessions = history.filter(h => { const d = new Date(h.id); const w = new Date(); w.setDate(w.getDate() - 7); return d > w; }).length;
  const streak = Math.min(weekSessions, user.freq || 3);
  const streakPct = Math.round((streak / (user.freq || 3)) * 100);
  const motivations = ["Every session counts. Show up.", "The only bad workout is the one you didn't do.", "Consistency > Perfection.", "Build the body you want. Start now.", "Your future self is watching.", "Rest day yesterday? Time to work."];
  const motiveLine = motivations[new Date().getDay() % motivations.length];
  const favCount = getFavourites().length;

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 20px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase" }}>{timeGreeting()}</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 1, lineHeight: 1 }}>{user.name.toUpperCase()}<span style={{ color: "#FF6B35" }}>.</span></div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{dayOfWeek()}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <button onClick={onEditProfile} style={{ background: "none", border: "1px solid #222", borderRadius: 10, padding: "7px 13px", color: "#555", fontSize: 11, cursor: "pointer" }}>✎ Edit</button>
          <button onClick={onSwitchUser} style={{ background: "none", border: "1px solid #222", borderRadius: 10, padding: "7px 13px", color: "#555", fontSize: 11, cursor: "pointer" }}>⇄ Switch</button>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#FF6B3566", fontStyle: "italic", marginBottom: 28, marginTop: 12 }}>"{motiveLine}"</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[{ label: "Total Sessions", val: history.length, icon: "🗓" }, { label: "This Week", val: `${weekSessions}/${user.freq}`, icon: "📅" }, { label: "Favourites", val: favCount, icon: "⭐" }].map(s => (
          <div key={s.label} style={{ background: "#141414", border: "1px solid #1E1E1E", borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#F0F0F0" }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#141414", border: "1px solid #1E1E1E", borderRadius: 16, padding: "18px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: 1.5 }}>Weekly Target</div>
          <div style={{ fontSize: 12, color: "#FF6B35", fontWeight: 600 }}>{streak}/{user.freq} days</div>
        </div>
        <ProgressBar value={streakPct} />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {Array.from({ length: user.freq || 3 }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 28, borderRadius: 8, background: i < streak ? "#FF6B35" : "#1A1A1A", border: `1px solid ${i < streak ? "#FF6B35" : "#2A2A2A"}`, transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      <div style={{ background: "#111", borderRadius: 16, padding: "16px 18px", marginBottom: 20, border: "1px solid #1A1A1A" }}>
        <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Active Goals</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {user.goals.map(g => { const goal = GOALS.find(x => x.id === g); return goal ? <Chip key={g} label={goal.label} icon={goal.icon} selected small /> : null; })}
        </div>
      </div>

      {lastSession && (
        <div style={{ background: "#141414", border: "1px solid #1E1E1E", borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Last Session</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#F0F0F0" }}>{lastSession.label}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{lastSession.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#FF6B35" }}>{lastSession.sets}</div>
              <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase" }}>sets done</div>
            </div>
          </div>
        </div>
      )}
      <button onClick={onWorkout} style={{ ...btnStyle, width: "100%", marginBottom: 12 }}>Start Today's Workout →</button>
      <button onClick={onHistory} style={{ ...btnStyle, width: "100%", background: "#141414", color: "#888", border: "1px solid #1E1E1E" }}>View Progress Log</button>
    </div>
  );
}

// ─────────────────────────────────────────
// ADD EXERCISE PANEL
// ─────────────────────────────────────────
function AddExercisePanel({ currentExercises, onAdd, onClose }) {
  const [category, setCategory] = useState(null);
  const [customForm, setCustomForm] = useState({ name: "", sets: "3", reps: "10–12", rest: "60s" });
  const currentIds = new Set(currentExercises.map(e => e.id));
  const cat = ADD_EXERCISE_CATEGORIES.find(c => c.id === category);

  const getList = () => {
    if (!cat) return [];
    if (cat.source === "main") return (ALL_EXERCISES[cat.id] || []).filter(e => !currentIds.has(e.id));
    if (cat.source === "extra") return EXTRA_EXERCISES.filter(e => e.muscleGroup === cat.id && !currentIds.has(e.id));
    return [];
  };

  const submitCustom = () => {
    if (!customForm.name.trim()) return;
    onAdd({ id: "custom_" + Date.now(), name: customForm.name.trim(), sets: parseInt(customForm.sets) || 3, reps: customForm.reps || "10–12", rest: customForm.rest || "60s", equipment: [], muscle: "Custom", muscleGroup: "custom", type: "Custom", difficulty: 2, tip: "", tipDetail: "", cue: "", equipmentLabel: "—" });
  };

  const list = getList();
  return (
    <div style={{ background: "#141414", border: "1px solid #1E1E1E", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>{category ? (cat?.label || "Add exercise") : "Add an exercise"}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>
      {!category ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ADD_EXERCISE_CATEGORIES.map(c => <Chip key={c.id} label={c.label} icon={c.icon} selected={false} onClick={() => setCategory(c.id)} small />)}
        </div>
      ) : cat?.source === "custom" ? (
        <div>
          <button onClick={() => setCategory(null)} style={{ ...backBtnStyle, padding: "0 0 12px", fontSize: 12 }}>← Back</button>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input placeholder="Exercise name *" value={customForm.name} onChange={e => setCustomForm(f => ({...f, name: e.target.value}))} style={{ ...inputStyle, padding: "10px 14px", fontSize: 13 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Sets" type="number" min="1" max="10" value={customForm.sets} onChange={e => setCustomForm(f => ({...f, sets: e.target.value}))} style={{ ...inputStyle, padding: "10px 14px", fontSize: 13, flex: 1 }} />
              <input placeholder="Reps" value={customForm.reps} onChange={e => setCustomForm(f => ({...f, reps: e.target.value}))} style={{ ...inputStyle, padding: "10px 14px", fontSize: 13, flex: 1 }} />
              <input placeholder="Rest" value={customForm.rest} onChange={e => setCustomForm(f => ({...f, rest: e.target.value}))} style={{ ...inputStyle, padding: "10px 14px", fontSize: 13, flex: 1 }} />
            </div>
            <button onClick={submitCustom} disabled={!customForm.name.trim()} style={{ ...btnStyle, width: "100%", opacity: customForm.name.trim() ? 1 : 0.4 }}>Add Custom ✓</button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => setCategory(null)} style={{ ...backBtnStyle, padding: "0 0 12px", fontSize: 12 }}>← Back</button>
          {list.length === 0
            ? <div style={{ fontSize: 12, color: "#444", padding: "8px 0" }}>No more exercises in this category.</div>
            : list.map(ex => {
              const mg = MUSCLE_GROUPS.find(m => m.id === (cat.source === "main" ? cat.id : ex.muscleGroup));
              return (
                <button key={ex.id} onClick={() => onAdd({ ...ex, muscleGroup: cat.source === "main" ? cat.id : ex.muscleGroup })} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "#0F0F0F", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", color: "#F0F0F0", cursor: "pointer", marginBottom: 8, textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{ex.sets}×{ex.reps} · {ex.type}{mg ? ` · ${mg.icon}` : ""}</div>
                  </div>
                  <span style={{ color: "#FF6B35" }}>+</span>
                </button>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// WORKOUT BUILDER
// ─────────────────────────────────────────
function WorkoutBuilderScreen({ user, onBack, onStartWorkout }) {
  const [step, setStep] = useState("setup");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [sessionEquipment, setSessionEquipment] = useState([]);
  const [sessionDuration, setSessionDuration] = useState(user.duration);
  const [exercises, setExercises] = useState([]);
  const [replacing, setReplacing] = useState(null);
  const [showAddExtra, setShowAddExtra] = useState(false);
  const [editingSetRep, setEditingSetRep] = useState(null);
  const [editSets, setEditSets] = useState("");
  const [editReps, setEditReps] = useState("");
  const [expandedTip, setExpandedTip] = useState(null);
  const [favourites, setFavourites] = useState(getFavourites());

  const allSelected = sessionEquipment.length === EQUIPMENT_LIST.length;
  const toggleGroup = (id) => setSelectedGroups(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleEquipment = (id) => setSessionEquipment(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleAllEquipment = () => setSessionEquipment(allSelected ? [] : ALL_EQUIPMENT_IDS);

  const buildWorkout = () => {
    const muscleIds = [...new Set(selectedGroups.flatMap(g => GROUP_TO_MUSCLES[g] || [g]))];
    const exs = getExercisesForMuscles(muscleIds, sessionEquipment, sessionDuration);
    // Apply saved prefs (sets/reps) to each exercise
    const withPrefs = exs.map(ex => {
      const pref = getExPref(ex.id);
      return pref ? { ...ex, sets: pref.sets, reps: pref.reps } : ex;
    });
    setExercises(withPrefs);
    setStep("plan");
  };

  const removeExercise = (idx) => { setExercises(prev => prev.filter((_, i) => i !== idx)); if (editingSetRep === idx) setEditingSetRep(null); };
  const moveExercise = (idx, dir) => {
    const next = idx + dir;
    if (next < 0 || next >= exercises.length) return;
    setExercises(prev => { const a = [...prev]; [a[idx], a[next]] = [a[next], a[idx]]; return a; });
  };
  const replaceWith = (idx, newEx) => { setExercises(prev => prev.map((e, i) => i === idx ? { ...newEx, muscleGroup: newEx.muscleGroup || e.muscleGroup } : e)); setReplacing(null); };
  const getAlternatives = (ex) => {
    const currentIds = new Set(exercises.map(e => e.id));
    return (ALL_EXERCISES[ex.muscleGroup] || []).filter(e => e.id !== ex.id && !currentIds.has(e.id) && (sessionEquipment.length === 0 || e.equipment.some(eq => sessionEquipment.includes(eq) || eq === "bodyweight")));
  };
  const startEditSetRep = (idx) => { const ex = exercises[idx]; setEditSets(String(ex.sets)); setEditReps(String(ex.reps)); setEditingSetRep(idx); };
  const saveSetRep = (idx) => {
    const newSets = parseInt(editSets);
    if (!isNaN(newSets) && newSets > 0 && editReps.trim()) {
      setExercises(prev => prev.map((e, i) => {
        if (i !== idx) return e;
        saveExPref(e.id, newSets, editReps.trim()); // save preference
        return { ...e, sets: newSets, reps: editReps.trim() };
      }));
    }
    setEditingSetRep(null);
  };
  const handleToggleFav = (exId) => { const next = toggleFavourite(exId); setFavourites(next); };
  const DIFF_DOTS = (n) => "●".repeat(n) + "○".repeat(4 - n);

  if (step === "setup") return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "36px 20px 80px" }}>
      <button onClick={onBack} style={backBtnStyle}>← Back</button>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 1, marginBottom: 28 }}>TODAY'S<br /><span style={{ color: "#FF6B35" }}>SESSION</span></div>

      <div style={{ fontSize: 11, color: "#FF6B35", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>What are we training?</div>
      {MUSCLE_CATEGORIES.map(cat => (
        <div key={cat.id} style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{cat.label}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cat.groups.map(gid => {
              const m = MUSCLE_GROUPS.find(x => x.id === gid);
              return m ? <Chip key={m.id} label={m.label} icon={m.icon} selected={selectedGroups.includes(m.id)} onClick={() => toggleGroup(m.id)} color={m.color} small /> : null;
            })}
          </div>
        </div>
      ))}

      <div style={{ width: "100%", height: 1, background: "#1A1A1A", margin: "24px 0 20px" }} />
      <div style={{ fontSize: 11, color: "#FF6B35", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Equipment available?</div>
      <button onClick={handleAllEquipment} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, marginBottom: 12, border: `2px solid ${allSelected ? "#FF6B35" : "#333"}`, background: allSelected ? "#FF6B3518" : "#141414", color: allSelected ? "#FF6B35" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span>{allSelected ? "✓" : "🏟️"}</span> Full Gym (All Equipment)
      </button>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {EQUIPMENT_LIST.map(e => <Chip key={e.id} label={e.label} icon={e.icon} selected={sessionEquipment.includes(e.id)} onClick={() => toggleEquipment(e.id)} small />)}
      </div>

      <div style={{ width: "100%", height: 1, background: "#1A1A1A", margin: "24px 0 20px" }} />
      <div style={{ fontSize: 11, color: "#FF6B35", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>How much time today?</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
        {DURATION_OPTIONS.map(d => <Chip key={d.id} label={d.label} selected={sessionDuration === d.id} onClick={() => setSessionDuration(d.id)} small />)}
      </div>

      <button onClick={buildWorkout} disabled={selectedGroups.length === 0 || sessionEquipment.length === 0} style={{ ...btnStyle, width: "100%", opacity: (selectedGroups.length > 0 && sessionEquipment.length > 0) ? 1 : 0.4 }}>Build My Workout ⚡</button>
    </div>
  );

  const selectedGroupsMeta = selectedGroups.map(g => MUSCLE_GROUPS.find(m => m.id === g)).filter(Boolean);
  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "36px 20px 80px" }}>
      <button onClick={() => setStep("setup")} style={backBtnStyle}>← Back</button>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 1, marginBottom: 6 }}>TODAY'S<br /><span style={{ color: "#FF6B35" }}>SESSION</span></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {selectedGroupsMeta.map(m => <Tag key={m.id} label={`${m.icon} ${m.label}`} color={m.color} />)}
        <Tag label={`${exercises.length} exercises`} color="#555" />
        <Tag label={`~${sessionDuration} min`} color="#555" />
      </div>
      <Divider label="Your workout — tap sets×reps to edit" />
      {exercises.map((ex, idx) => {
        const mg = MUSCLE_GROUPS.find(m => m.id === ex.muscleGroup);
        const alts = getAlternatives(ex);
        const isEditingThis = editingSetRep === idx;
        const isFav = favourites.includes(ex.id);
        const tipExpanded = expandedTip === idx;
        return (
          <div key={ex.id + idx} style={{ background: "#141414", border: "1px solid #1E1E1E", borderRadius: 16, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1, paddingRight: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#F0F0F0" }}>{ex.name}</div>
                    <button onClick={() => handleToggleFav(ex.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1, flexShrink: 0 }} title={isFav ? "Remove from favourites" : "Add to favourites"}>
                      {isFav ? "⭐" : "☆"}
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {mg && <Tag label={`${mg.icon} ${mg.label}`} color={mg.color} />}
                    <Tag label={ex.muscle} color={mg?.color || "#666"} />
                    <Tag label={ex.type} color="#555" />
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {isEditingThis ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input value={editSets} onChange={e => setEditSets(e.target.value)} placeholder="Sets" type="number" min="1" max="10" style={{ ...inputStyle, width: 60, padding: "6px 10px", fontSize: 13, textAlign: "center" }} />
                        <span style={{ color: "#555" }}>×</span>
                        <input value={editReps} onChange={e => setEditReps(e.target.value)} placeholder="Reps" style={{ ...inputStyle, width: 72, padding: "6px 10px", fontSize: 13, textAlign: "center" }} />
                      </div>
                      <button onClick={() => saveSetRep(idx)} style={{ ...smallBtnStyle, fontSize: 11, padding: "5px 12px", color: "#FF6B35", borderColor: "#FF6B35" }}>Save ✓</button>
                    </div>
                  ) : (
                    <button onClick={() => startEditSetRep(idx)} style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 10, padding: "8px 12px", cursor: "pointer", textAlign: "right", transition: "border-color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#2A2A2A"}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#F0F0F0", lineHeight: 1 }}>{ex.sets}×{ex.reps}</div>
                      <div style={{ fontSize: 9, color: "#FF6B3577", marginTop: 2 }}>tap to edit</div>
                    </button>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#888", background: "#1A1A1A", padding: "4px 10px", borderRadius: 20 }}>🛠 {ex.equipmentLabel || ex.equipment.join(", ")}</span>
                <span style={{ fontSize: 11, color: "#666", background: "#1A1A1A", padding: "4px 10px", borderRadius: 20 }}>{DIFF_DOTS(ex.difficulty)}</span>
                <span style={{ fontSize: 11, color: "#666", background: "#1A1A1A", padding: "4px 10px", borderRadius: 20 }}>⏱ {ex.rest}</span>
              </div>

              {/* Expandable tip */}
              <button onClick={() => setExpandedTip(tipExpanded ? null : idx)} style={{ display: "flex", alignItems: "flex-start", gap: 6, width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: "#555", borderLeft: `2px solid ${mg?.color || "#FF6B35"}`, paddingLeft: 10, lineHeight: 1.5, flex: 1 }}>💡 {ex.tip}</div>
                {ex.tipDetail && <span style={{ fontSize: 10, color: "#FF6B3566", flexShrink: 0, marginTop: 2 }}>{tipExpanded ? "▲" : "▼ more"}</span>}
              </button>
              {tipExpanded && ex.tipDetail && (
                <div style={{ fontSize: 12, color: "#666", background: "#0F0F0F", borderRadius: 10, padding: "12px 14px", marginBottom: 10, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                  {ex.tipDetail}
                </div>
              )}

              <div style={{ fontSize: 11, color: "#666", background: "#0F0F0F", borderRadius: 8, padding: "7px 12px", marginBottom: 10 }}>🎯 <span style={{ color: "#888" }}>{ex.cue}</span></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setReplacing(replacing === idx ? null : idx)} style={{ ...smallBtnStyle, flex: 1, color: replacing === idx ? "#FF6B35" : "#666" }}>{replacing === idx ? "✕ Cancel" : "⇄ Swap"}</button>
                <button onClick={() => moveExercise(idx, -1)} disabled={idx === 0} style={{ ...smallBtnStyle, padding: "10px 12px", opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                <button onClick={() => moveExercise(idx, 1)} disabled={idx === exercises.length - 1} style={{ ...smallBtnStyle, padding: "10px 12px", opacity: idx === exercises.length - 1 ? 0.3 : 1 }}>↓</button>
                <button onClick={() => removeExercise(idx)} style={{ ...smallBtnStyle, color: "#E63946" }}>× Remove</button>
              </div>
            </div>
            {replacing === idx && (
              <div style={{ background: "#0F0F0F", borderTop: "1px solid #1A1A1A", padding: "14px" }}>
                <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Swap with a different {mg?.label || ""} exercise:</div>
                {alts.length === 0 ? <div style={{ fontSize: 12, color: "#444", padding: "8px 0" }}>No other options for current equipment.</div>
                  : alts.map(alt => (
                  <button key={alt.id} onClick={() => replaceWith(idx, alt)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "#141414", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", color: "#F0F0F0", cursor: "pointer", marginBottom: 8, textAlign: "left" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{alt.name}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{alt.sets}×{alt.reps} · 🛠 {alt.equipmentLabel || alt.equipment.join(", ")}</div>
                    </div>
                    <span style={{ color: "#FF6B35", fontSize: 14 }}>+</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {showAddExtra
        ? <AddExercisePanel currentExercises={exercises} onAdd={ex => { setExercises(prev => [...prev, ex]); setShowAddExtra(false); }} onClose={() => setShowAddExtra(false)} />
        : <button onClick={() => setShowAddExtra(true)} style={{ ...smallBtnStyle, width: "100%", marginBottom: 14, borderStyle: "dashed", color: "#555" }}>+ Add Exercise</button>
      }
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={buildWorkout} style={{ ...smallBtnStyle, flex: "0 0 auto" }}>↻ Rebuild</button>
        <button onClick={() => onStartWorkout(exercises, selectedGroups, sessionDuration)} style={{ ...btnStyle, flex: 1 }}>Start Session →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// REST TIMER
// ─────────────────────────────────────────
function RestTimer({ seconds, onStop, color = "#FF6B35" }) {
  const [remaining, setRemaining] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (paused) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(intervalRef.current); onStop(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ - (circ * (remaining / seconds));
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const urgent = remaining <= 5 && remaining > 0;

  return (
    <div style={{ background: "#0A0A0A", border: `2px solid ${color}44`, borderRadius: 20, padding: "20px 20px 16px", marginBottom: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2 }}>Rest Timer</div>
      <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="100" height="100" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#1A1A1A" strokeWidth="6" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s linear" }} />
        </svg>
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: urgent ? "#E63946" : "#F0F0F0", lineHeight: 1, transition: "color 0.3s", animation: urgent ? "timerPulse 0.55s ease-in-out infinite" : "none" }}>
            {fmt(remaining)}
          </div>
          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>remaining</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        <button onClick={() => setPaused(p => !p)} style={{ ...smallBtnStyle, flex: 1, color: paused ? "#FF6B35" : "#888", borderColor: paused ? "#FF6B3544" : "#222" }}>{paused ? "▶ Resume" : "⏸ Pause"}</button>
        <button onClick={onStop} style={{ ...smallBtnStyle, flex: 1, color: "#E63946", borderColor: "#E6394422" }}>Skip Rest</button>
      </div>
      <div style={{ display: "flex", gap: 6, width: "100%" }}>
        {[30, 60, 90, 120].map(s => (
          <button key={s} onClick={() => { setRemaining(s); setPaused(false); }} style={{ flex: 1, padding: "6px 0", background: "#141414", border: `1px solid ${remaining === s ? color : "#222"}`, borderRadius: 8, color: remaining === s ? color : "#555", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>{s}s</button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ACTIVE WORKOUT — all refinements applied
// ─────────────────────────────────────────
function ActiveWorkoutScreen({ user, exercises: initialExercises, groups, sessionDuration, onFinish, onBack }) {
  const [activeExercises, setActiveExercises] = useState(initialExercises);
  const [completedSets, setCompletedSets] = useState({});
  const [weights, setWeights] = useState({});
  const [activeWeightInput, setActiveWeightInput] = useState(null);
  const [restTimer, setRestTimer] = useState(null);
  const [startTime] = useState(Date.now());
  const [replacingActive, setReplacingActive] = useState(null);
  const [showAddInActive, setShowAddInActive] = useState(false);
  const [editingActiveSetRep, setEditingActiveSetRep] = useState(null);
  const [activeEditSets, setActiveEditSets] = useState("");
  const [activeEditReps, setActiveEditReps] = useState("");
  const [expandedTip, setExpandedTip] = useState(null);
  const [favourites, setFavourites] = useState(getFavourites());

  const totalSets = activeExercises.reduce((a, e) => a + (typeof e.sets === "number" ? e.sets : 1), 0);
  const doneSets = Object.values(completedSets).filter(Boolean).length;
  const progress = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;
  const isComplete = progress === 100;

  // Mark ALL sets of an exercise as done in one tap
  const completeAllSets = (ei, ex) => {
    const setCount = typeof ex.sets === "number" ? ex.sets : 1;
    const allAlreadyDone = Array.from({ length: setCount }, (_, si) => completedSets[`${ei}-${si}`]).every(Boolean);
    if (allAlreadyDone) {
      // Un-complete all
      setCompletedSets(p => {
        const next = { ...p };
        Array.from({ length: setCount }, (_, si) => delete next[`${ei}-${si}`]);
        return next;
      });
      setRestTimer(null);
    } else {
      // Complete all — open weight input for last set then timer
      const updates = {};
      Array.from({ length: setCount }, (_, si) => { updates[`${ei}-${si}`] = true; });
      setCompletedSets(p => ({ ...p, ...updates }));
      const mg = MUSCLE_GROUPS.find(m => m.id === ex.muscleGroup);
      const lastKey = `${ei}-${setCount - 1}`;
      setActiveWeightInput({ key: lastKey, ei, si: setCount - 1, ex });
      setRestTimer(null);
    }
  };

  const toggleSet = (ei, si, ex) => {
    const key = `${ei}-${si}`;
    const nowDone = !completedSets[key];
    setCompletedSets(p => ({ ...p, [key]: nowDone }));
    if (nowDone) { setActiveWeightInput({ key, ei, si, ex }); setRestTimer(null); }
    else { if (activeWeightInput?.key === key) setActiveWeightInput(null); if (restTimer?.key === key) setRestTimer(null); }
  };

  const dismissWeightAndStartTimer = (ex, key) => {
    setActiveWeightInput(null);
    const mg = MUSCLE_GROUPS.find(m => m.id === ex.muscleGroup);
    setRestTimer({ key, seconds: parseRestSeconds(ex.rest), color: mg?.color || "#FF6B35" });
  };

  const setWeight = (key, val) => setWeights(p => ({ ...p, [key]: val }));

  const removeActiveExercise = (idx) => {
    setActiveExercises(prev => prev.filter((_, i) => i !== idx));
    setCompletedSets(prev => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => {
        const [eiStr] = k.split("-");
        const ei = parseInt(eiStr);
        if (ei < idx) next[k] = v;
        else if (ei > idx) next[`${ei - 1}-${k.split("-")[1]}`] = v;
      });
      return next;
    });
  };

  const replaceActiveExercise = (idx, newEx) => {
    setActiveExercises(prev => prev.map((e, i) => i === idx ? { ...newEx } : e));
    setCompletedSets(prev => { const next = { ...prev }; Object.keys(next).forEach(k => { if (k.startsWith(`${idx}-`)) delete next[k]; }); return next; });
    setWeights(prev => { const next = { ...prev }; Object.keys(next).forEach(k => { if (k.startsWith(`${idx}-`)) delete next[k]; }); return next; });
    setReplacingActive(null);
  };

  const startActiveEditSetRep = (idx) => { const ex = activeExercises[idx]; setActiveEditSets(String(ex.sets)); setActiveEditReps(String(ex.reps)); setEditingActiveSetRep(idx); };
  const saveActiveSetRep = (idx) => {
    const newSets = parseInt(activeEditSets);
    if (!isNaN(newSets) && newSets > 0 && activeEditReps.trim()) {
      setActiveExercises(prev => prev.map((e, i) => {
        if (i !== idx) return e;
        saveExPref(e.id, newSets, activeEditReps.trim());
        return { ...e, sets: newSets, reps: activeEditReps.trim() };
      }));
    }
    setEditingActiveSetRep(null);
  };

  const getActiveAlts = (ex, idx) => {
    const currentIds = new Set(activeExercises.filter((_, i) => i !== idx).map(e => e.id));
    return (ALL_EXERCISES[ex.muscleGroup] || []).filter(e => e.id !== ex.id && !currentIds.has(e.id));
  };

  const handleToggleFav = (exId) => { const next = toggleFavourite(exId); setFavourites(next); };

  const handleFinish = () => {
    const elapsed = Math.round((Date.now() - startTime) / 60000);
    const groupLabels = groups.map(g => MUSCLE_GROUPS.find(m => m.id === g)?.label).filter(Boolean).join(" + ");
    const exercise_details = activeExercises.map((ex, ei) => {
      const setCount = typeof ex.sets === "number" ? ex.sets : 1;
      const setsCompleted = Array.from({ length: setCount }, (_, si) => completedSets[`${ei}-${si}`]).filter(Boolean).length;
      const exWeights = Array.from({ length: setCount }, (_, si) => weights[`${ei}-${si}`] || "");
      return { name: ex.name, muscle: ex.muscle, muscleGroup: ex.muscleGroup, sets: setCount, reps: ex.reps, setsCompleted, weights: exWeights, equipmentLabel: ex.equipmentLabel };
    });
    const entry = { id: Date.now(), date: today(), label: `${groupLabels || "Custom"} Day`, exercises: activeExercises.length, sets: doneSets, duration: elapsed, exercises_list: activeExercises.map(e => e.name), exercise_details };
    const history = loadData(`history_${user.id}`, []);
    saveData(`history_${user.id}`, [...history, entry]);
    onFinish(entry);
  };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "36px 20px 80px" }}>
      <button onClick={onBack} style={backBtnStyle}>← Back to plan</button>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1 }}>IN SESSION</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "#FF6B35" }}>{progress}%</div>
        </div>
        <ProgressBar value={progress} />
        <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>{doneSets} / {totalSets} sets complete</div>
      </div>

      {restTimer && <RestTimer key={restTimer.key + restTimer.seconds} seconds={restTimer.seconds} color={restTimer.color} onStop={() => setRestTimer(null)} />}

      {activeWeightInput && completedSets[activeWeightInput.key] && (
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 16, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>Weight for <span style={{ color: "#F0F0F0", fontWeight: 600 }}>{activeWeightInput.ex.name}</span> — Set {activeWeightInput.si + 1}</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="number" placeholder="kg — leave blank to skip" value={weights[activeWeightInput.key] || ""} onChange={e => setWeight(activeWeightInput.key, e.target.value)} autoFocus style={{ ...inputStyle, flex: 1, padding: "10px 14px", fontSize: 14 }} />
            <button onClick={() => dismissWeightAndStartTimer(activeWeightInput.ex, activeWeightInput.key)} style={{ ...btnStyle, padding: "10px 18px", fontSize: 16, flexShrink: 0 }}>Rest ⏱</button>
          </div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 8 }}>
            Tap "Rest" to log and start your timer · or <button onClick={() => setActiveWeightInput(null)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11, padding: 0, textDecoration: "underline" }}>skip both</button>
          </div>
        </div>
      )}

      {isComplete && (
        <div style={{ background: "#141414", border: "2px solid #FF6B35", borderRadius: 16, padding: "24px", marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#FF6B35", marginBottom: 6 }}>SESSION COMPLETE!</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Every set done. That's what separates you from the rest.</div>
          <button onClick={handleFinish} style={{ ...btnStyle, width: "100%" }}>Log & Finish 🔥</button>
        </div>
      )}

      {activeExercises.map((ex, ei) => {
        const mg = MUSCLE_GROUPS.find(m => m.id === ex.muscleGroup);
        const setCount = typeof ex.sets === "number" ? ex.sets : 1;
        const doneSetsForEx = Array.from({ length: setCount }, (_, si) => completedSets[`${ei}-${si}`]).filter(Boolean).length;
        const allDone = doneSetsForEx === setCount;
        const alts = getActiveAlts(ex, ei);
        const isEditingThis = editingActiveSetRep === ei;
        const isFav = favourites.includes(ex.id);
        const tipExpanded = expandedTip === ei;

        return (
          <div key={ei} style={{
            background: "#141414",
            border: `1px solid ${allDone ? "#FF6B3533" : "#1E1E1E"}`,
            borderRadius: 16, marginBottom: 12, overflow: "hidden",
            opacity: allDone ? 0.55 : 1, transition: "all 0.3s",
          }}>
            <div style={{ padding: "18px" }}>
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: allDone ? "#555" : "#F0F0F0" }}>{ex.name}</div>
                    <button onClick={() => handleToggleFav(ex.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1, flexShrink: 0 }}>
                      {isFav ? "⭐" : "☆"}
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {mg && <Tag label={`${mg.icon} ${mg.label}`} color={mg.color} />}
                    <Tag label={`${ex.reps} reps`} color={mg?.color || "#FF6B35"} />
                    <Tag label={`🛠 ${ex.equipmentLabel || ex.equipment?.[0] || "—"}`} color="#444" />
                  </div>
                </div>
                {/* Sets control — tap to edit, or shows done count */}
                <div style={{ flexShrink: 0, marginLeft: 10 }}>
                  {isEditingThis ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <input value={activeEditSets} onChange={e => setActiveEditSets(e.target.value)} type="number" min="1" max="10" style={{ ...inputStyle, width: 50, padding: "4px 8px", fontSize: 12, textAlign: "center" }} />
                        <span style={{ color: "#555", fontSize: 11 }}>×</span>
                        <input value={activeEditReps} onChange={e => setActiveEditReps(e.target.value)} style={{ ...inputStyle, width: 68, padding: "4px 8px", fontSize: 12, textAlign: "center" }} />
                      </div>
                      <button onClick={() => saveActiveSetRep(ei)} style={{ ...smallBtnStyle, fontSize: 10, padding: "4px 10px", color: "#FF6B35", borderColor: "#FF6B35" }}>Save ✓</button>
                    </div>
                  ) : (
                    <button onClick={() => startActiveEditSetRep(ei)} style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 10, padding: "8px 12px", cursor: "pointer", textAlign: "right" }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: allDone ? "#555" : "#F0F0F0", lineHeight: 1 }}>{doneSetsForEx}/{setCount}</div>
                      <div style={{ fontSize: 9, color: "#555" }}>sets · ⏱ {ex.rest}</div>
                    </button>
                  )}
                </div>
              </div>

              {/* Individual set tiles */}
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                {Array.from({ length: setCount }, (_, si) => {
                  const key = `${ei}-${si}`;
                  const done = !!completedSets[key];
                  const w = weights[key];
                  const isTimingThis = restTimer?.key === key;
                  return (
                    <button key={si} onClick={() => toggleSet(ei, si, ex)} style={{
                      width: 50, height: 50, borderRadius: 12,
                      border: `2px solid ${isTimingThis ? "#FF6B35" : done ? "#FF6B3566" : "#2A2A2A"}`,
                      background: done ? (isTimingThis ? "#FF6B3522" : "#FF6B3511") : "#0F0F0F",
                      color: done ? "#FF6B35" : "#555",
                      fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, lineHeight: 1.2,
                    }}>
                      {done ? (<><span style={{ fontSize: 13 }}>✓</span>{w && <span style={{ fontSize: 8, color: "#FF6B35aa" }}>{w}kg</span>}</>) : <span style={{ fontSize: 12 }}>S{si + 1}</span>}
                    </button>
                  );
                })}

                {/* Complete all sets in one tap */}
                <button onClick={() => completeAllSets(ei, ex)} style={{
                  height: 50, paddingLeft: 10, paddingRight: 10, borderRadius: 12,
                  border: `2px solid ${allDone ? "#FF6B3566" : "#2A2A2A"}`,
                  background: "#0F0F0F", color: allDone ? "#FF6B3566" : "#555",
                  fontSize: 10, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                }} title="Complete all sets at once">
                  {allDone ? "↩ Undo all" : "✓ All"}
                </button>
              </div>

              {/* Tip — expandable */}
              {ex.tip && (
                <button onClick={() => setExpandedTip(tipExpanded ? null : ei)} style={{ display: "flex", alignItems: "flex-start", gap: 6, width: "100%", background: "none", border: "none", cursor: ex.tipDetail ? "pointer" : "default", textAlign: "left", padding: 0, marginBottom: ex.tipDetail ? 6 : 10 }}>
                  <div style={{ fontSize: 12, color: "#555", borderLeft: `2px solid ${mg?.color || "#FF6B35"}`, paddingLeft: 10, lineHeight: 1.5, flex: 1 }}>💡 {ex.tip}</div>
                  {ex.tipDetail && <span style={{ fontSize: 10, color: "#FF6B3566", flexShrink: 0, marginTop: 2 }}>{tipExpanded ? "▲" : "▼"}</span>}
                </button>
              )}
              {tipExpanded && ex.tipDetail && (
                <div style={{ fontSize: 12, color: "#666", background: "#0F0F0F", borderRadius: 10, padding: "12px 14px", marginBottom: 10, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                  {ex.tipDetail}
                </div>
              )}

              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5, marginBottom: 10 }}>🎯 {ex.cue}</div>

              {/* Action row */}
              {!allDone && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setReplacingActive(replacingActive === ei ? null : ei)} style={{ ...smallBtnStyle, fontSize: 11, padding: "7px 12px", color: replacingActive === ei ? "#FF6B35" : "#555" }}>{replacingActive === ei ? "✕" : "⇄ Swap"}</button>
                  <button onClick={() => removeActiveExercise(ei)} style={{ ...smallBtnStyle, fontSize: 11, padding: "7px 12px", color: "#E63946" }}>× Remove</button>
                </div>
              )}
            </div>

            {/* Swap panel */}
            {replacingActive === ei && (
              <div style={{ background: "#0F0F0F", borderTop: "1px solid #1A1A1A", padding: "14px" }}>
                <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Swap with:</div>
                {alts.length === 0 ? <div style={{ fontSize: 12, color: "#444" }}>No alternatives found.</div>
                  : alts.slice(0, 5).map(alt => (
                    <button key={alt.id} onClick={() => replaceActiveExercise(ei, { ...alt, muscleGroup: ex.muscleGroup })} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "#141414", border: "1px solid #222", borderRadius: 10, padding: "10px 14px", color: "#F0F0F0", cursor: "pointer", marginBottom: 8, textAlign: "left" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{alt.name}</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{alt.sets}×{alt.reps} · 🛠 {alt.equipmentLabel || alt.equipment.join(", ")}</div>
                      </div>
                      <span style={{ color: "#FF6B35" }}>⇄</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        );
      })}

      {showAddInActive
        ? <AddExercisePanel currentExercises={activeExercises} onAdd={ex => { setActiveExercises(prev => [...prev, ex]); setShowAddInActive(false); }} onClose={() => setShowAddInActive(false)} />
        : <button onClick={() => setShowAddInActive(true)} style={{ ...smallBtnStyle, width: "100%", marginBottom: 14, borderStyle: "dashed", color: "#555" }}>+ Add Exercise</button>
      }

      {!isComplete && doneSets > 0 && (
        <button onClick={handleFinish} style={{ ...smallBtnStyle, width: "100%", marginTop: 8 }}>End Session Early & Log Progress</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// HISTORY
// ─────────────────────────────────────────
function HistoryScreen({ user, onBack }) {
  const history = loadData(`history_${user.id}`, []);
  const [expandedSession, setExpandedSession] = useState(null);
  const [viewMode, setViewMode] = useState("sessions");

  const byMuscle = {};
  history.forEach(h => {
    if (!h.exercise_details) return;
    h.exercise_details.forEach(ex => {
      const mgId = ex.muscleGroup || "other";
      const mg = MUSCLE_GROUPS.find(m => m.id === mgId);
      const key = mg ? `${mg.icon} ${mg.label}` : "Other";
      if (!byMuscle[key]) byMuscle[key] = { color: mg?.color || "#666", entries: [] };
      byMuscle[key].entries.push({ ...ex, date: h.date, sessionLabel: h.label, sessionId: h.id });
    });
  });

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "36px 20px 80px" }}>
      <button onClick={onBack} style={backBtnStyle}>← Back</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 1, lineHeight: 1 }}>PROGRESS<br /><span style={{ color: "#FF6B35" }}>LOG</span></div>
        <button onClick={() => exportToCSV(history, user.name)} style={{ ...smallBtnStyle, fontSize: 11, padding: "7px 12px", color: "#06D6A0", borderColor: "#06D6A044" }}>↓ Export CSV</button>
      </div>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>{history.length} sessions logged</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setViewMode("sessions")} style={{ ...smallBtnStyle, flex: 1, color: viewMode === "sessions" ? "#FF6B35" : "#666", borderColor: viewMode === "sessions" ? "#FF6B35" : "#222" }}>By Session</button>
        <button onClick={() => setViewMode("muscles")} style={{ ...smallBtnStyle, flex: 1, color: viewMode === "muscles" ? "#FF6B35" : "#666", borderColor: viewMode === "muscles" ? "#FF6B35" : "#222" }}>By Muscle Group</button>
      </div>
      {history.length === 0 && <div style={{ textAlign: "center", color: "#444", padding: "60px 0" }}>No sessions yet. Complete your first workout to start tracking.</div>}

      {viewMode === "sessions" && [...history].reverse().map((h) => (
        <div key={h.id} style={{ background: "#141414", border: "1px solid #1E1E1E", borderRadius: 16, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#F0F0F0", marginBottom: 4 }}>{h.label}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{h.date}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#FF6B35" }}>{h.sets}</div>
                  <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase" }}>sets</div>
                </div>
                <button onClick={() => setExpandedSession(expandedSession === h.id ? null : h.id)} style={{ background: "none", border: "1px solid #2A2A2A", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "#555", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {expandedSession === h.id ? "↑" : "↓"}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Tag label={`${h.exercises} exercises`} color="#444" />
              {h.duration && <Tag label={`${h.duration} min`} color="#444" />}
            </div>
          </div>
          {expandedSession === h.id && h.exercise_details && (
            <div style={{ borderTop: "1px solid #1A1A1A" }}>
              {h.exercise_details.map((ex, i) => {
                const mg = MUSCLE_GROUPS.find(m => m.id === ex.muscleGroup);
                const hasWeights = ex.weights && ex.weights.some(w => w);
                return (
                  <div key={i} style={{ padding: "14px 18px", borderBottom: i < h.exercise_details.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#E0E0E0", marginBottom: 4 }}>{ex.name}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {mg && <Tag label={`${mg.icon} ${mg.label}`} color={mg.color} />}
                          <Tag label={ex.muscle} color={mg?.color || "#555"} />
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#F0F0F0" }}>{ex.setsCompleted}/{ex.sets}×{ex.reps}</div>
                        <div style={{ fontSize: 9, color: "#555" }}>done/total × reps</div>
                      </div>
                    </div>
                    {hasWeights && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                        {ex.weights.map((w, wi) => w ? <span key={wi} style={{ fontSize: 11, background: "#FF6B3511", border: "1px solid #FF6B3533", color: "#FF6B35", padding: "3px 10px", borderRadius: 20 }}>S{wi + 1}: {w}kg</span> : null)}
                      </div>
                    )}
                    {!hasWeights && <div style={{ fontSize: 11, color: "#333", marginTop: 4 }}>No weights logged</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {viewMode === "muscles" && Object.keys(byMuscle).length === 0 && <div style={{ textAlign: "center", color: "#444", padding: "40px 0" }}>Complete a session with weight tracking to see muscle group breakdown.</div>}
      {viewMode === "muscles" && Object.entries(byMuscle).map(([groupName, { color, entries }]) => {
        const byExercise = {};
        entries.forEach(e => { if (!byExercise[e.name]) byExercise[e.name] = []; byExercise[e.name].push(e); });
        return (
          <div key={groupName} style={{ background: "#141414", border: "1px solid #1E1E1E", borderRadius: 16, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #1A1A1A", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 28, borderRadius: 2, background: color, flexShrink: 0 }} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1, color: "#F0F0F0" }}>{groupName}</div>
              <div style={{ marginLeft: "auto", fontSize: 11, color: "#555" }}>{Object.keys(byExercise).length} exercises</div>
            </div>
            {Object.entries(byExercise).map(([exName, exEntries]) => {
              const allWeights = exEntries.flatMap(e => (e.weights || []).filter(w => w).map(w => parseFloat(w))).filter(n => !isNaN(n));
              const bestWeight = allWeights.length > 0 ? Math.max(...allWeights) : null;
              const lastEntry = exEntries[exEntries.length - 1];
              const lastWeights = (lastEntry.weights || []).filter(w => w);
              return (
                <div key={exName} style={{ padding: "12px 18px", borderBottom: "1px solid #111" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#E0E0E0", marginBottom: 2 }}>{exName}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>Last: {lastEntry.date} · {lastEntry.setsCompleted}/{lastEntry.sets}×{lastEntry.reps}</div>
                    </div>
                    {bestWeight && <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#FF6B35" }}>{bestWeight}kg</div>
                      <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase" }}>best</div>
                    </div>}
                  </div>
                  {lastWeights.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {lastWeights.map((w, wi) => <span key={wi} style={{ fontSize: 11, background: `${color}11`, border: `1px solid ${color}33`, color, padding: "3px 10px", borderRadius: 20 }}>S{wi + 1}: {w}kg</span>)}
                  </div>}
                  {lastWeights.length === 0 && <div style={{ fontSize: 11, color: "#2A2A2A" }}>No weights logged yet</div>}
                  <div style={{ fontSize: 10, color: "#3A3A3A", marginTop: 6 }}>{exEntries.length} session{exEntries.length > 1 ? "s" : ""} tracked</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────
// COOLDOWN
// ─────────────────────────────────────────
function CooldownScreen({ onDone, onSkip }) {
  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const doneCount = Object.values(checked).filter(Boolean).length;
  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "48px 20px 80px" }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 1, marginBottom: 6 }}>COOL<span style={{ color: "#4ECDC4" }}>DOWN</span></div>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 28 }}>Take 5–10 minutes to stretch. Your future self will thank you.</div>
      {COOLDOWN_EXERCISES.map(ex => (
        <button key={ex.id} onClick={() => toggle(ex.id)} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", background: checked[ex.id] ? "#0A1A1A" : "#141414", border: `1px solid ${checked[ex.id] ? "#4ECDC4" : "#1E1E1E"}`, borderRadius: 14, padding: "14px 18px", marginBottom: 10, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${checked[ex.id] ? "#4ECDC4" : "#333"}`, background: checked[ex.id] ? "#4ECDC4" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: "#0A0A0A", transition: "all 0.15s" }}>
            {checked[ex.id] ? "✓" : ""}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: checked[ex.id] ? "#4ECDC4" : "#F0F0F0", marginBottom: 2 }}>{ex.name}</div>
            <div style={{ fontSize: 11, color: "#555" }}>{ex.duration} · {ex.muscle}</div>
          </div>
        </button>
      ))}
      <div style={{ fontSize: 12, color: "#555", textAlign: "center", margin: "20px 0 24px" }}>{doneCount} / {COOLDOWN_EXERCISES.length} stretches done</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onDone} style={{ ...btnStyle, width: "100%", background: "#4ECDC4", color: "#0A0A0A" }}>All Done — Finish 🎉</button>
        <button onClick={onSkip} style={{ ...smallBtnStyle, width: "100%", color: "#555" }}>Skip Cooldown</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// FINISH SCREEN
// ─────────────────────────────────────────
function FinishScreen({ entry, onHome, onViewLog }) {
  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🏆</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#FF6B35", marginBottom: 8, letterSpacing: 2 }}>LOGGED.</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#F0F0F0", marginBottom: 12 }}>{entry.label}</div>
      <div style={{ color: "#555", fontSize: 14, marginBottom: 20 }}>{entry.date}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
        <Tag label={`${entry.exercises} exercises`} color="#FF6B35" />
        <Tag label={`${entry.sets} sets done`} color="#FF6B35" />
        {entry.duration && <Tag label={`${entry.duration} min`} color="#FF6B35" />}
      </div>
      {entry.exercise_details && entry.exercise_details.some(e => e.weights && e.weights.some(w => w)) && (
        <div style={{ background: "#141414", border: "1px solid #1E1E1E", borderRadius: 16, padding: "16px", marginBottom: 32, textAlign: "left" }}>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Weights logged today</div>
          {entry.exercise_details.filter(e => e.weights && e.weights.some(w => w)).map((ex, i) => {
            const mg = MUSCLE_GROUPS.find(m => m.id === ex.muscleGroup);
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{ex.name}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ex.weights.map((w, wi) => w ? <span key={wi} style={{ fontSize: 11, background: `${mg?.color || "#FF6B35"}11`, border: `1px solid ${mg?.color || "#FF6B35"}33`, color: mg?.color || "#FF6B35", padding: "3px 10px", borderRadius: 20 }}>S{wi + 1}: {w}kg</span> : null)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onHome} style={{ ...btnStyle, width: "100%" }}>Back to Home</button>
        <button onClick={onViewLog} style={{ ...btnStyle, width: "100%", background: "#141414", color: "#888", border: "1px solid #1E1E1E" }}>View Progress Log</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────
function SplashScreen() {
  const dur = "3.2s";
  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0A",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 32px", textAlign: "center",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 48, animation: `splashLine1 ${dur} ease forwards` }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 64, letterSpacing: 4, lineHeight: 1,
          color: "#F0F0F0",
        }}>
          GYM<span style={{ color: "#FF6B35" }}>BRAIN</span>
        </div>
        {/* Underline accent */}
        <div style={{
          height: 3, background: "#FF6B35", borderRadius: 2, marginTop: 10,
          animation: `splashBar ${dur} ease forwards`,
        }} />
      </div>

      {/* Copy lines — staggered */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 300 }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 22, letterSpacing: 1.5, color: "#F0F0F0",
          animation: `splashLine2 ${dur} ease forwards`,
        }}>
          Built for people who show up.
        </div>

        <div style={{
          fontSize: 15, color: "#888", lineHeight: 1.6,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          animation: `splashLine3 ${dur} ease forwards`,
        }}>
          Your session. Your goals.<br />Zero planning required.
        </div>

        <div style={{
          fontSize: 14, color: "#555", lineHeight: 1.6,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          animation: `splashLine4 ${dur} ease forwards`,
        }}>
          The only thing left to think about is lifting.
        </div>
      </div>

      {/* Loading cue */}
      <div style={{
        marginTop: 64,
        animation: `splashCta ${dur} ease forwards`,
      }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#FF6B35",
              animation: `timerPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <div style={{
          fontSize: 11, color: "#333", letterSpacing: 3,
          textTransform: "uppercase", marginTop: 12,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Let's get to work
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const inputStyle = { width: "100%", background: "#111", border: "1px solid #222", borderRadius: 12, padding: "14px 16px", color: "#F0F0F0", fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none" };
const btnStyle = { background: "#FF6B35", color: "#0A0A0A", border: "none", borderRadius: 14, padding: "16px 24px", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1.5, transition: "all 0.15s" };
const smallBtnStyle = { background: "#141414", color: "#666", border: "1px solid #222", borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, transition: "all 0.15s" };
const backBtnStyle = { background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", padding: "0 0 28px", display: "block", fontFamily: "'DM Sans', sans-serif" };

// ─────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────
export default function GymBrain() {
  const [screen, setScreen] = useState("loading");
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [workoutGroups, setWorkoutGroups] = useState([]);
  const [workoutDuration, setWorkoutDuration] = useState(null);
  const [finishedEntry, setFinishedEntry] = useState(null);

  useEffect(() => {
  const saved = loadData("gymbrain_users", []);
  setUsers(saved);
  const next = saved.length > 0 ? "user_select" : "onboarding";
  const timer = setTimeout(() => setScreen(next), 3400);
  return () => clearTimeout(timer);
}, []);

  const handleOnboardingComplete = (form) => {
    if (form.id) {
      const updated = users.map(u => u.id === form.id ? { ...u, ...form } : u);
      saveData("gymbrain_users", updated);
      setUsers(updated);
      setActiveUser(updated.find(u => u.id === form.id));
      setEditingUser(null);
      setScreen("home");
    } else {
      const user = { ...form, id: Date.now() };
      const updated = [...users, user];
      saveData("gymbrain_users", updated);
      setUsers(updated);
      setActiveUser(user);
      setScreen("home");
    }
  };

  const handleRemoveUser = (userId) => {
    const updated = users.filter(u => u.id !== userId);
    saveData("gymbrain_users", updated);
    try { localStorage.removeItem(`history_${userId}`); } catch(e) {}
    setUsers(updated);
    if (updated.length === 0) setScreen("onboarding");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#F0F0F0", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; } button { outline: none; } input { outline: none; }
        input::placeholder { color: #444; } input:focus { border-color: #FF6B35 !important; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #222; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        @keyframes timerPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes splashBar { from { width: 0%; } to { width: 100%; } }
        @keyframes splashLine1 { 0%,12% { opacity:0; transform:translateY(12px); } 24%,100% { opacity:1; transform:translateY(0); } }
        @keyframes splashLine2 { 0%,28% { opacity:0; transform:translateY(12px); } 40%,100% { opacity:1; transform:translateY(0); } }
        @keyframes splashLine3 { 0%,44% { opacity:0; transform:translateY(12px); } 56%,100% { opacity:1; transform:translateY(0); } }
        @keyframes splashLine4 { 0%,60% { opacity:0; transform:translateY(12px); } 72%,100% { opacity:1; transform:translateY(0); } }
        @keyframes splashCta   { 0%,78% { opacity:0; } 92%,100% { opacity:0.5; } }
      `}</style>
      <div className="fade-up">
        {screen === "loading" && <SplashScreen />}
        {screen === "onboarding" && <OnboardingScreen onComplete={handleOnboardingComplete} existingUser={editingUser} />}
        {screen === "user_select" && <UserSelectScreen users={users} onSelect={u => { setActiveUser(u); setScreen("home"); }} onNew={() => { setEditingUser(null); setScreen("onboarding"); }} onRemove={handleRemoveUser} />}
        {screen === "home" && activeUser && <HomeScreen user={activeUser} onWorkout={() => setScreen("builder")} onHistory={() => setScreen("history")} onEditProfile={() => { setEditingUser(activeUser); setScreen("onboarding"); }} onSwitchUser={() => setScreen("user_select")} />}
        {screen === "builder" && activeUser && <WorkoutBuilderScreen user={activeUser} onBack={() => setScreen("home")} onStartWorkout={(exs, groups, dur) => { setWorkoutExercises(exs); setWorkoutGroups(groups); setWorkoutDuration(dur); setScreen("active"); }} />}
        {screen === "active" && activeUser && <ActiveWorkoutScreen user={activeUser} exercises={workoutExercises} groups={workoutGroups} sessionDuration={workoutDuration} onFinish={e => { setFinishedEntry(e); setScreen("cooldown"); }} onBack={() => setScreen("builder")} />}
        {screen === "cooldown" && <CooldownScreen onDone={() => setScreen("finish")} onSkip={() => setScreen("finish")} />}
        {screen === "history" && activeUser && <HistoryScreen user={activeUser} onBack={() => setScreen("home")} />}
        {screen === "finish" && finishedEntry && <FinishScreen entry={finishedEntry} onHome={() => setScreen("home")} onViewLog={() => setScreen("history")} />}
      </div>
    </div>
  );
}
