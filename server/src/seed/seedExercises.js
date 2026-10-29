const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exercise = require('../models/Exercise');
const connectDB = require('../config/db');

dotenv.config();

const BASE_URL = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/';

const allExercises = [
  // ==================== CHEST ====================
  {
    name: 'Barbell Bench Press',
    muscleGroup: 'Chest',
    equipment: 'Barbell',
    description: 'Flat barbell bench press for chest mass and pushing strength',
    gifUrl: `${BASE_URL}videos/0025-EIeI8Vf.gif`,
  },
  {
    name: 'Incline Barbell Press',
    muscleGroup: 'Chest',
    equipment: 'Barbell',
    description: 'Incline bench barbell press targeting upper pectoral fibers',
    gifUrl: `${BASE_URL}videos/0047-3TZduzM.gif`,
  },
  {
    name: 'Decline Barbell Press',
    muscleGroup: 'Chest',
    equipment: 'Barbell',
    description: 'Decline barbell bench press emphasizing the lower pectorals',
    gifUrl: `${BASE_URL}videos/0033-GrO65fd.gif`,
  },
  {
    name: 'Machine Chest Fly (Pec Dec)',
    muscleGroup: 'Chest',
    equipment: 'Machine',
    description: 'Seated machine fly for maximum chest squeeze and isolation',
    gifUrl: `${BASE_URL}videos/0596-v3xmPAR.gif`,
  },
  {
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    equipment: 'Dumbbells',
    description: 'Upper chest dumbbell press for balanced hypertrophy',
    gifUrl: `${BASE_URL}videos/3545-TVdivgY.gif`,
  },
  {
    name: 'Cable Chest Flyes',
    muscleGroup: 'Chest',
    equipment: 'Cable',
    description: 'Continuous tension chest isolation with cable crossover',
    gifUrl: `${BASE_URL}videos/0188-xLYSdtg.gif`,
  },
  {
    name: 'Push-Ups',
    muscleGroup: 'Chest',
    equipment: 'Bodyweight',
    description: 'Classic bodyweight calisthenics movement for chest and triceps',
    gifUrl: `${BASE_URL}videos/0662-lBDjFxJ.gif`,
  },
  {
    name: 'Dips (Chest Focus)',
    muscleGroup: 'Chest',
    equipment: 'Parallel Bars',
    description: 'Forward-leaning parallel bar dips for lower chest development',
    gifUrl: `${BASE_URL}videos/0251-9WTm7dq.gif`,
  },

  // ==================== BACK ====================
  {
    name: 'Hyperextension',
    muscleGroup: 'Back',
    equipment: 'Bench',
    description: 'Lower back, erector spinae, and posterior chain extension',
    gifUrl: `${BASE_URL}videos/0489-zhMwOwE.gif`,
  },
  {
    name: 'Wide Grip Lat Pulldown',
    muscleGroup: 'Back',
    equipment: 'Cable Machine',
    description: 'Wide grip vertical cable pulldown for building V-taper lats',
    gifUrl: `${BASE_URL}videos/2330-LEprlgG.gif`,
  },
  {
    name: 'Rope Pullover (Straight-Arm Pulldown)',
    muscleGroup: 'Back',
    equipment: 'Cable Machine',
    description: 'Straight-arm cable pullover focusing on pure lat contraction',
    gifUrl: `${BASE_URL}videos/0237-DT14T9T.gif`,
  },
  {
    name: 'Seated Rowing',
    muscleGroup: 'Back',
    equipment: 'Cable Machine',
    description: 'Horizontal seated cable row for middle back and rhomboids thickness',
    gifUrl: `${BASE_URL}videos/0861-fUBheHs.gif`,
  },
  {
    name: 'Deadlift',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    description: 'King of compound pulling movements for full posterior chain strength',
    gifUrl: `${BASE_URL}videos/0032-ila4NZS.gif`,
  },
  {
    name: 'Pull-Ups',
    muscleGroup: 'Back',
    equipment: 'Pull-Up Bar',
    description: 'Vertical bodyweight pull for broad latissimus dorsi',
    gifUrl: `${BASE_URL}videos/0652-lBDjFxJ.gif`,
  },
  {
    name: 'Barbell Bent-Over Row',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    description: 'Heavy compound horizontal barbell row for back thickness',
    gifUrl: `${BASE_URL}videos/0027-eZyBC3j.gif`,
  },

  // ==================== LEGS ====================
  {
    name: 'Barbell Back Squat',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    description: 'Fundamental lower body compound exercise for quads and glutes',
    gifUrl: `${BASE_URL}videos/0043-qXTaZnJ.gif`,
  },
  {
    name: 'Split Squat',
    muscleGroup: 'Legs',
    equipment: 'Dumbbells / Bodyweight',
    description: 'Unilateral quad and glute strength with rear leg elevated or split',
    gifUrl: `${BASE_URL}videos/0410-qx4fgX7.gif`,
  },
  {
    name: 'Hamstring Curls (Lying)',
    muscleGroup: 'Legs',
    equipment: 'Machine',
    description: 'Lying machine leg curl targeting hamstring knee flexion',
    gifUrl: `${BASE_URL}videos/0586-17lJ1kr.gif`,
  },
  {
    name: 'Leg Extension',
    muscleGroup: 'Legs',
    equipment: 'Machine',
    description: 'Seated quad isolation machine for rectus femoris and tear-drop',
    gifUrl: `${BASE_URL}videos/0585-my33uHU.gif`,
  },
  {
    name: 'Lunges',
    muscleGroup: 'Legs',
    equipment: 'Dumbbells',
    description: 'Dynamic walking or standing lunges for athletic leg development',
    gifUrl: `${BASE_URL}videos/0336-RRWFUcw.gif`,
  },
  {
    name: 'Romanian Deadlift (RDL)',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    description: 'Posterior chain stretch focusing on hamstrings and glutes',
    gifUrl: `${BASE_URL}videos/0085-wQ2c4XD.gif`,
  },
  {
    name: 'Leg Press',
    muscleGroup: 'Legs',
    equipment: 'Machine',
    description: '45-degree sled leg press for high volume quad loading',
    gifUrl: `${BASE_URL}videos/1463-2Qh2J1e.gif`,
  },
  {
    name: 'Standing Calf Raises',
    muscleGroup: 'Legs',
    equipment: 'Barbell / Machine',
    description: 'Standing calf raises for gastrocnemius mass and ankle stability',
    gifUrl: `${BASE_URL}videos/1372-8ozhUIZ.gif`,
  },

  // ==================== SHOULDERS ====================
  {
    name: 'Overhead Press (Standing Military Press)',
    muscleGroup: 'Shoulders',
    equipment: 'Barbell',
    description: 'Strict standing barbell military overhead press for deltoid power',
    gifUrl: `${BASE_URL}videos/1456-wdRZISl.gif`,
  },
  {
    name: 'Upright Row',
    muscleGroup: 'Shoulders',
    equipment: 'Barbell',
    description: 'Barbell pull along the torso for lateral delts and traps',
    gifUrl: `${BASE_URL}videos/0120-UDlhcO8.gif`,
  },
  {
    name: 'Front Raises',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells',
    description: 'Anterior deltoid isolation with controlled frontal raising',
    gifUrl: `${BASE_URL}videos/0310-3eGE2JC.gif`,
  },
  {
    name: 'Reverse Pec Dec Fly (Rear Delt)',
    muscleGroup: 'Shoulders',
    equipment: 'Machine',
    description: 'Seated reverse machine fly for posterior rear deltoid isolation',
    gifUrl: `${BASE_URL}videos/0602-myfUsKf.gif`,
  },
  {
    name: 'Dumbbell Lateral Raise',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells',
    description: 'The golden exercise for building side deltoid width and roundness',
    gifUrl: `${BASE_URL}videos/0334-DsgkuIt.gif`,
  },
  {
    name: 'Dumbbell Arnold Press',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells',
    description: 'Rotating dumbbell overhead press hitting all three deltoid heads',
    gifUrl: `${BASE_URL}videos/2137-Xy4jlWA.gif`,
  },
  {
    name: 'Face Pulls (Rope Cable)',
    muscleGroup: 'Shoulders',
    equipment: 'Cable Machine',
    description: 'Rope cable pull to eye-level for healthy rotator cuffs and rear delts',
    gifUrl: `${BASE_URL}videos/3697-G61cXLk.gif`,
  },

  // ==================== BICEPS ====================
  {
    name: 'Preacher Curls',
    muscleGroup: 'Biceps',
    equipment: 'EZ Bar / Barbell',
    description: 'Strict preacher bench curl preventing shoulder momentum for bicep peak',
    gifUrl: `${BASE_URL}videos/0070-qOgPVf6.gif`,
  },
  {
    name: 'Hammer Curls',
    muscleGroup: 'Biceps',
    equipment: 'Dumbbells',
    description: 'Neutral grip dumbbell curl targeting the brachialis and outer bicep',
    gifUrl: `${BASE_URL}videos/0313-slDvUAU.gif`,
  },
  {
    name: 'Concentration Curls',
    muscleGroup: 'Biceps',
    equipment: 'Dumbbell',
    description: 'Seated isolated bicep curl bracing the elbow against the inner thigh',
    gifUrl: `${BASE_URL}videos/0089-1V1gj1u.gif`,
  },
  {
    name: 'Barbell Bicep Curl',
    muscleGroup: 'Biceps',
    equipment: 'Barbell',
    description: 'Classic heavy standing barbell curl for overall bicep mass',
    gifUrl: `${BASE_URL}videos/0031-25GPyDY.gif`,
  },

  // ==================== TRICEPS ====================
  {
    name: 'Rope Skull Crushers',
    muscleGroup: 'Triceps',
    equipment: 'Cable',
    description: 'Cable rope lying triceps extensions keeping tension constant',
    gifUrl: `${BASE_URL}videos/0186-uxJcFUU.gif`,
  },
  {
    name: 'Dumbbell Skull Crushers',
    muscleGroup: 'Triceps',
    equipment: 'Dumbbells',
    description: 'Lying triceps extensions with dumbbells for deep long-head stretch',
    gifUrl: `${BASE_URL}videos/0351-mpKZGWz.gif`,
  },
  {
    name: 'Pulley Push Down',
    muscleGroup: 'Triceps',
    equipment: 'Cable Machine',
    description: 'Straight bar or angled bar cable triceps pushdown',
    gifUrl: `${BASE_URL}videos/0201-3ZflifB.gif`,
  },
  {
    name: 'Single Hand Pulley Push Down',
    muscleGroup: 'Triceps',
    equipment: 'Cable Machine',
    description: 'Unilateral cable pushdown for perfecting symmetry and peak contraction',
    gifUrl: `${BASE_URL}videos/1723-qRZ5S1N.gif`,
  },
  {
    name: 'Tricep Rope Pushdown',
    muscleGroup: 'Triceps',
    equipment: 'Cable Machine',
    description: 'Rope attachment cable triceps pushdown with flare at bottom',
    gifUrl: `${BASE_URL}videos/0201-3ZflifB.gif`,
  },

  // ==================== FOREARMS ====================
  {
    name: 'Reverse Barbell Curls',
    muscleGroup: 'Forearms',
    equipment: 'Barbell',
    description: 'Overhand pronated grip barbell curl targeting the brachioradialis',
    gifUrl: `${BASE_URL}videos/0080-xNrS20v.gif`,
  },
  {
    name: 'Wrist Curls',
    muscleGroup: 'Forearms',
    equipment: 'Barbell / Dumbbell',
    description: 'Forearm flexion wrist curls for massive forearms and grip strength',
    gifUrl: `${BASE_URL}videos/0126-82LxxkW.gif`,
  },

  // ==================== CORE ====================
  {
    name: 'Russian Twists',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    description: 'Rotational seated movement for internal and external obliques',
    gifUrl: `${BASE_URL}videos/0687-XVDdcoj.gif`,
  },
  {
    name: 'Russian Crunches',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    description: 'Cross-body crunch targeting rotational and anterior core strength',
    gifUrl: `${BASE_URL}videos/0262-rbu5UUb.gif`,
  },
  {
    name: 'Sit-Ups',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    description: 'Full range of motion sit-ups for upper and lower rectus abdominis',
    gifUrl: `${BASE_URL}videos/3204-NAkmgdx.gif`,
  },
  {
    name: 'Hanging Leg Raises',
    muscleGroup: 'Core',
    equipment: 'Pull-Up Bar',
    description: 'Hanging abdominal exercise targeting lower abs and hip flexors',
    gifUrl: `${BASE_URL}videos/0472-I3tsCnC.gif`,
  },
  {
    name: 'Plank',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    description: 'Isometric core stability and abdominal wall bracing',
    gifUrl: `${BASE_URL}videos/3544-5VXmnV5.gif`,
  },
  {
    name: 'Ab Wheel Rollout',
    muscleGroup: 'Core',
    equipment: 'Ab Wheel',
    description: 'Advanced anterior core stability and anti-extension strength',
    gifUrl: `${BASE_URL}videos/0857-NAgVB3t.gif`,
  },

  // ==================== CARDIO ====================
  {
    name: 'Jumping Jacks',
    muscleGroup: 'Cardio',
    equipment: 'Bodyweight',
    description: 'Full body aerobic exercise for warm-up and conditioning',
    gifUrl: `${BASE_URL}videos/3224-1g5bPpA.gif`,
  },
  {
    name: "Farmer's Walk",
    muscleGroup: 'Cardio',
    equipment: 'Heavy Dumbbells / Trap Bar',
    description: 'Heavy loaded carry building trap strength, grip, and work capacity',
    gifUrl: `${BASE_URL}videos/2133-qPEzJjA.gif`,
  },
  {
    name: 'Skipping (Jump Rope)',
    muscleGroup: 'Cardio',
    equipment: 'Jump Rope',
    description: 'High-speed footwork, calves, and anaerobic conditioning',
    gifUrl: `${BASE_URL}videos/2612-e1e76I2.gif`,
  },
  {
    name: 'Treadmill Incline Walk / Run',
    muscleGroup: 'Cardio',
    equipment: 'Treadmill',
    description: 'Incline cardiovascular endurance and calorie incineration',
    gifUrl: `${BASE_URL}videos/3666-rjiM4L3.gif`,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Exercise.deleteMany({ user: null });
    await Exercise.insertMany(allExercises);
    console.log(`✅ Successfully seeded ALL ${allExercises.length} exercises (new + original preserved)!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding exercises:', err.message);
    process.exit(1);
  }
};

seed();
