import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';


const client = postgres("postgres://root:secret@localhost:5432/local");

export const db = drizzle(client, { schema });

// Seed configuration
const SEED_CONFIG = {
  patients: 1000,        // Base patients
  batchSize: 50,        // Process patients in batches
  admissionsPerPatient: { min: 1, max: 4 },
  icuStaysPerAdmission: { min: 0, max: 2 },
  labEventsPerAdmission: { min: 5, max: 50 },
  chartEventsPerIcuStay: { min: 20, max: 200 },
  prescriptionsPerAdmission: { min: 1, max: 15 },
  notesPerAdmission: { min: 1, max: 8 },
  microbiologyPerAdmission: { min: 0, max: 5 },
};

// Medical data constants
const DIAGNOSIS_CODES = [
  { code: '414.01', short: 'Cor athero native', long: 'Coronary atherosclerosis of native coronary artery' },
  { code: '038.9', short: 'Septicemia NOS', long: 'Unspecified septicemia' },
  { code: '410.71', short: 'Subendo infarct, init', long: 'Subendocardial infarction, initial episode of care' },
  { code: '428.0', short: 'CHF NOS', long: 'Congestive heart failure, unspecified' },
  { code: '584.9', short: 'Acute kidney failure NOS', long: 'Acute kidney failure, unspecified' },
  { code: '507.0', short: 'Pneumonia due to food/vomit', long: 'Pneumonitis due to inhalation of food or vomitus' },
  { code: '785.52', short: 'Septic shock', long: 'Septic shock' },
  { code: '518.81', short: 'Acute respiratory failure', long: 'Acute respiratory failure' },
  { code: '995.92', short: 'Severe sepsis', long: 'Severe sepsis' },
  { code: '276.2', short: 'Acidosis', long: 'Acidosis' },
  { code: '99.04', short: 'Transfusion packed cells', long: 'Transfusion of packed cells' }
];

const PROCEDURE_CODES = [
  { code: '96.72', short: 'Circ assist NOS', long: 'Circulatory monitoring' },
  { code: '96.04', short: 'Insert endotracheal tube', long: 'Insertion of endotracheal tube' },
  { code: '89.54', short: 'Echocardiography', long: 'Echocardiography' },
  { code: '38.93', short: 'Venous catheterization', long: 'Venous catheterization, not elsewhere classified' },
  { code: '96.6', short: 'Enteral infusion nutrients', long: 'Enteral infusion of concentrated nutritional substances' },
  { code: '93.90', short: 'Respiratory therapy NOS', long: 'Respiratory therapy, not elsewhere classified' },
  { code: '57.94', short: 'Insert urethral catheter', long: 'Insertion of indwelling urinary catheter' },
];

const LAB_ITEMS = [
  { id: '50861', label: 'Alanine Aminotransferase (ALT)', fluid: 'Blood', category: 'Chemistry', loinc: '1742-6' },
  { id: '50862', label: 'Albumin', fluid: 'Blood', category: 'Chemistry', loinc: '1751-7' },
  { id: '50863', label: 'Alkaline Phosphatase', fluid: 'Blood', category: 'Chemistry', loinc: '6768-6' },
  { id: '50868', label: 'Anion Gap', fluid: 'Blood', category: 'Chemistry', loinc: '1863-0' },
  { id: '50878', label: 'Asparate Aminotransferase (AST)', fluid: 'Blood', category: 'Chemistry', loinc: '1920-8' },
  { id: '50882', label: 'Bicarbonate', fluid: 'Blood', category: 'Blood Gas', loinc: '1963-8' },
  { id: '50885', label: 'Bilirubin, Total', fluid: 'Blood', category: 'Chemistry', loinc: '1975-2' },
  { id: '50912', label: 'Creatinine', fluid: 'Blood', category: 'Chemistry', loinc: '2160-0' },
  { id: '50920', label: 'Estimated GFR', fluid: 'Blood', category: 'Chemistry', loinc: '33914-3' },
  { id: '50931', label: 'Glucose', fluid: 'Blood', category: 'Chemistry', loinc: '2345-7' },
  { id: '51006', label: 'Urea Nitrogen', fluid: 'Blood', category: 'Chemistry', loinc: '3094-0' },
  { id: '51144', label: 'Bands', fluid: 'Blood', category: 'Hematology', loinc: '35332-6' },
  { id: '51146', label: 'Basophils', fluid: 'Blood', category: 'Hematology', loinc: '705-2' },
  { id: '51200', label: 'Eosinophils', fluid: 'Blood', category: 'Hematology', loinc: '713-8' },
  { id: '51221', label: 'Hematocrit', fluid: 'Blood', category: 'Hematology', loinc: '4544-3' },
  { id: '51222', label: 'Hemoglobin', fluid: 'Blood', category: 'Hematology', loinc: '718-7' },
];

const CHART_ITEMS = [
  { id: '220045', label: 'Heart Rate', category: 'Vital Signs', unit: 'bpm', paramType: 'NUMERIC' as const },
  { id: '220179', label: 'Non Invasive Blood Pressure systolic', category: 'Vital Signs', unit: 'mmHg', paramType: 'NUMERIC' as const },
  { id: '220180', label: 'Non Invasive Blood Pressure diastolic', category: 'Vital Signs', unit: 'mmHg', paramType: 'NUMERIC' as const },
  { id: '220210', label: 'Respiratory Rate', category: 'Vital Signs', unit: 'insp/min', paramType: 'NUMERIC' as const },
  { id: '223761', label: 'Temperature Fahrenheit', category: 'Vital Signs', unit: 'Deg. F', paramType: 'NUMERIC' as const },
  { id: '220277', label: 'O2 saturation pulseoxymetry', category: 'Vital Signs', unit: '%', paramType: 'NUMERIC' as const },
  { id: '223900', label: 'GCS - Verbal Response', category: 'Neurologic', unit: '', paramType: 'NUMERIC' as const },
  { id: '223901', label: 'GCS - Motor Response', category: 'Neurologic', unit: '', paramType: 'NUMERIC' as const },
  { id: '220739', label: 'GCS - Eye Opening', category: 'Neurologic', unit: '', paramType: 'NUMERIC' as const },
];

const MEDICATIONS = [
  'Heparin', 'Insulin - Regular', 'Potassium Chloride', 'Furosemide', 'Metoprolol',
  'Morphine Sulfate', 'Acetaminophen', 'Albuterol', 'Atorvastatin', 'Lisinopril',
  'Aspirin', 'Pantoprazole', 'Warfarin', 'Levothyroxine', 'Amlodipine',
  'Metformin', 'Hydrochlorothiazide', 'Prednisone', 'Clopidogrel', 'Simvastatin'
];

const MICROORGANISMS = [
  'STAPHYLOCOCCUS AUREUS', 'ESCHERICHIA COLI', 'KLEBSIELLA PNEUMONIAE',
  'PSEUDOMONAS AERUGINOSA', 'ENTEROCOCCUS FAECALIS', 'CANDIDA ALBICANS',
  'STREPTOCOCCUS PNEUMONIAE', 'ACINETOBACTER BAUMANNII', 'ENTEROBACTER CLOACAE'
];

const ANTIBIOTICS = [
  'VANCOMYCIN', 'CEFTRIAXONE', 'PIPERACILLIN/TAZOBACTAM', 'LEVOFLOXACIN',
  'MEROPENEM', 'CIPROFLOXACIN', 'AMPICILLIN', 'GENTAMICIN', 'CLINDAMYCIN'
];

// Utility functions
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const randomChoice = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Generate patient ID in MIMIC format
const generatePatientId = (index: number) => `P${(100000 + index).toString()}`;
const generateAdmissionId = (patientIndex: number, admissionIndex: number) =>
  `A${(200000 + patientIndex * 10 + admissionIndex).toString()}`;
const generateIcuStayId = (patientIndex: number, admissionIndex: number, icuIndex: number) =>
  `I${(300000 + patientIndex * 100 + admissionIndex * 10 + icuIndex).toString()}`;

// Generate realistic lab values
function generateLabValue(itemId: string) {
  let valueNum: number | null = null;
  let flag: 'HIGH' | 'LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW' | 'NORMAL' | null = null;

  switch (itemId) {
    case '50912': // Creatinine
      valueNum = randomFloat(0.5, 3.0, 2);
      flag = valueNum > 1.3 ? 'HIGH' : valueNum < 0.6 ? 'LOW' : 'NORMAL';
      break;
    case '50931': // Glucose
      valueNum = randomFloat(70, 400);
      flag = valueNum > 140 ? 'HIGH' : valueNum < 70 ? 'LOW' : 'NORMAL';
      break;
    case '51221': // Hematocrit
      valueNum = randomFloat(25, 50, 1);
      flag = valueNum < 35 ? 'LOW' : valueNum > 45 ? 'HIGH' : 'NORMAL';
      break;
    default:
      valueNum = randomFloat(10, 100, 2);
      flag =
        Math.random() < 0.2
          ? randomChoice(['HIGH', 'LOW', 'CRITICAL_HIGH', 'CRITICAL_LOW'])
          : 'NORMAL';
  }

  return { valueNum, flag };
}

// Generate realistic vital sign values
function generateVitalValue(itemId: string) {
  switch (itemId) {
    case '220045': // Heart Rate
      return randomInt(50, 150);
    case '220179': // Systolic BP
      return randomInt(80, 200);
    case '220180': // Diastolic BP  
      return randomInt(40, 120);
    case '220210': // Respiratory Rate
      return randomInt(10, 40);
    case '223761': // Temperature
      return randomFloat(96.0, 104.0, 1);
    case '220277': // O2 Saturation
      return randomInt(85, 100);
    default:
      return randomFloat(1, 15, 0);
  }
}

async function seedReferenceData() {
  console.log('🏥 Seeding reference data...');

  await Promise.all([
    db.insert(schema.dIcdDiagnoses).values(
      DIAGNOSIS_CODES.map((d) => ({
        icd9Code: d.code,
        shortTitle: d.short,
        longTitle: d.long
      }))
    ),
    db.insert(schema.dIcdProcedures).values(
      PROCEDURE_CODES.map((p) => ({
        icd9Code: p.code,
        shortTitle: p.short,
        longTitle: p.long
      }))
    ),
    db.insert(schema.dLabitems).values(
      LAB_ITEMS.map((item) => ({
        itemId: item.id,
        label: item.label,
        fluid: item.fluid,
        category: item.category,
        loincCode: item.loinc
      }))
    ),
    // db.insert(schema.dChartitems).values(
    //   CHART_ITEMS.map((item) => ({
    //     itemId: item.id,
    //     label: item.label,
    //     category: item.category,
    //     unitname: item.unit,
    //     paramType: item.paramType,
    //     dbsource: 'METAVISION',
    //     linksto: 'chartevents'
    //   }))
    // )
  ]);
}

async function generateBatchData(startIndex: number, batchSize: number) {
  const patients: (typeof schema.patients.$inferInsert)[] = [];
  const admissions: (typeof schema.admissions.$inferInsert)[] = [];
  const icuStays: (typeof schema.icuStays.$inferInsert)[] = [];
  const diagnoses: (typeof schema.diagnosesIcd.$inferInsert)[] = [];
  const procedures: (typeof schema.proceduresIcd.$inferInsert)[] = [];
  const prescriptions: (typeof schema.prescriptions.$inferInsert)[] = [];
  const labEvents: (typeof schema.labevents.$inferInsert)[] = [];
  const chartEvents: (typeof schema.chartevents.$inferInsert)[] = [];
  const noteEvents: (typeof schema.noteevents.$inferInsert)[] = [];
  const microbiologyEvents: (typeof schema.microbiologyevents.$inferInsert)[] = [];

  for (let i = startIndex; i < startIndex + batchSize; i++) {
    const patientId = generatePatientId(i);
    const gender = randomChoice(['M', 'F'] as const);
    const dateOfBirth = faker.date.birthdate({ min: 18, max: 95, mode: 'age' });
    const hasExpired = Math.random() < 0.12; // ~12% mortality rate
    const dateOfDeath = hasExpired ?
      faker.date.between({ from: dateOfBirth, to: new Date() }) : null;

    // Add patient
    patients.push({
      subjectId: patientId,
      gender,
      dateOfBirth,
      dateOfDeath,
      expireFlag: hasExpired
    });

    // Generate admissions for this patient
    const numAdmissions = randomInt(
      SEED_CONFIG.admissionsPerPatient.min,
      SEED_CONFIG.admissionsPerPatient.max
    );

    for (let j = 0; j < numAdmissions; j++) {
      const admissionId = generateAdmissionId(i, j);
      const admitTime = faker.date.past({ years: 5 });
      const lengthOfStay = randomInt(1, 21); // 1-21 days
      const dischargeTime = new Date(admitTime.getTime() + lengthOfStay * 24 * 60 * 60 * 1000);
      const hospitalExpired = hasExpired && Math.random() < 0.5;
      const deathTime = hospitalExpired ?
        faker.date.between({ from: admitTime, to: dischargeTime }) : null;

      admissions.push({
        admissionId,
        subjectId: patientId,
        admitTime,
        dischargeTime: hospitalExpired ? deathTime : dischargeTime,
        deathTime,
        admissionType: randomChoice(['EMERGENCY', 'URGENT', 'ELECTIVE']),
        admissionLocation: randomChoice([
          'EMERGENCY ROOM ADMIT', 'PHYSICIAN REFERRAL', 'TRANSFER FROM HOSP/EXTRAM',
          'CLINIC REFERRAL/PREMATURE', 'TRANSFER FROM SKILLED NUR'
        ]),
        dischargeLocation: hospitalExpired ? null : randomChoice([
          'HOME', 'SKILLED NURSING FACILITY', 'HOME HEALTH CARE',
          'REHAB/DISTINCT PART HOSP', 'HOSPICE-HOME'
        ]),
        insurance: randomChoice(['MEDICARE', 'PRIVATE', 'MEDICAID', 'GOVERNMENT', 'SELF_PAY']),
        language: randomChoice(['ENGLISH', 'SPANISH', 'PORTUGUESE', 'CHINESE', 'RUSSIAN']),
        religion: randomChoice(['CATHOLIC', 'PROTESTANT', 'JEWISH', 'MUSLIM', 'BUDDHIST', 'NONE']),
        maritalStatus: randomChoice(['MARRIED', 'SINGLE', 'WIDOWED', 'DIVORCED']),
        ethnicity: randomChoice([
          'WHITE', 'BLACK/AFRICAN AMERICAN', 'HISPANIC/LATINO', 'ASIAN',
          'AMERICAN INDIAN/ALASKA NATIVE', 'OTHER', 'UNKNOWN'
        ]),
        diagnosis: faker.lorem.sentence(),
        hospitalExpireFlag: hospitalExpired,
        hasCharteventsData: true
      });

      // Generate diagnoses
      const diagnosisCount = randomInt(1, 5);
      for (let d = 0; d < diagnosisCount; d++) {
        diagnoses.push({
          subjectId: patientId,
          admissionId,
          seqNum: d + 1,
          icd9Code: randomChoice(DIAGNOSIS_CODES).code
        });
      }

      // Generate procedures
      const procedureCount = randomInt(0, 3);
      for (let p = 0; p < procedureCount; p++) {
        procedures.push({
          subjectId: patientId,
          admissionId,
          seqNum: p + 1,
          icd9Code: randomChoice(PROCEDURE_CODES).code
        });
      }

      // Generate prescriptions
      const prescriptionCount = randomInt(
        SEED_CONFIG.prescriptionsPerAdmission.min,
        SEED_CONFIG.prescriptionsPerAdmission.max
      );
      for (let rx = 0; rx < prescriptionCount; rx++) {
        const startDate = faker.date.between({ from: admitTime, to: dischargeTime });
        const endDate = faker.date.between({ from: startDate, to: dischargeTime });

        prescriptions.push({
          subjectId: patientId,
          admissionId,
          startDate,
          endDate,
          drug: randomChoice(MEDICATIONS),
          drugNameGeneric: randomChoice(MEDICATIONS),
          route: randomChoice(['IV', 'PO', 'IM', 'SL', 'TOP']),
          doseValRx: `${randomInt(1, 100)}`,
          doseUnitRx: randomChoice(['mg', 'mcg', 'units', 'mL'])
        });
      }

      // Generate lab events
      const labEventCount = randomInt(
        SEED_CONFIG.labEventsPerAdmission.min,
        SEED_CONFIG.labEventsPerAdmission.max
      );
      for (let lab = 0; lab < labEventCount; lab++) {
        const labItem = randomChoice(LAB_ITEMS);
        const chartTime = faker.date.between({ from: admitTime, to: dischargeTime });
        const { valueNum, flag } = generateLabValue(labItem.id);

        labEvents.push({
          subjectId: patientId,
          admissionId,
          itemId: labItem.id,
          chartTime,
          value: valueNum?.toString(),
          valueNum,
          valueUom: randomChoice(['mg/dL', 'mmol/L', 'g/dL', '%', 'units/L']),
          flag: flag as any
        });
      }

      // Generate ICU stays
      const icuStayCount = randomInt(
        SEED_CONFIG.icuStaysPerAdmission.min,
        SEED_CONFIG.icuStaysPerAdmission.max
      );

      for (let icu = 0; icu < icuStayCount; icu++) {
        const icuStayId = generateIcuStayId(i, j, icu);
        const icuInTime = faker.date.between({ from: admitTime, to: dischargeTime });
        const icuLength = randomInt(1, 10); // 1-10 days in ICU
        const icuOutTime = new Date(icuInTime.getTime() + icuLength * 24 * 60 * 60 * 1000);

        icuStays.push({
          icuStayId,
          subjectId: patientId,
          admissionId,
          careUnit: randomChoice(['MICU', 'SICU', 'CCU', 'CSRU']),
          inTime: icuInTime,
          outTime: icuOutTime,
          lengthOfStay: icuLength
        });

        // Generate chart events for ICU stay
        const chartEventCount = randomInt(
          SEED_CONFIG.chartEventsPerIcuStay.min,
          SEED_CONFIG.chartEventsPerIcuStay.max
        );

        for (let chart = 0; chart < chartEventCount; chart++) {
          // const chartItem = randomChoice(CHART_ITEMS);
          // const chartTime = faker.date.between({ from: icuInTime, to: icuOutTime });
          // const valueNum = generateVitalValue(chartItem.id);

          // chartEvents.push({
          //   subjectId: patientId,
          //   admissionId,
          //   icuStayId,
          //   itemId: chartItem.id,
          //   chartTime,
          //   value: valueNum?.toString(),
          //   valueNum,
          //   valueUom: chartItem.unit,
          //   cgid: `CG${randomInt(1000, 9999)}`
          // });
        }
      }

      // Generate clinical notes
      const noteCount = randomInt(
        SEED_CONFIG.notesPerAdmission.min,
        SEED_CONFIG.notesPerAdmission.max
      );

      for (let note = 0; note < noteCount; note++) {
        noteEvents.push({
          subjectId: patientId,
          admissionId,
          chartDate: faker.date.between({ from: admitTime, to: dischargeTime }),
          category: randomChoice([
            'Nursing',
            'Physician',
            'Discharge summary',
            'Radiology',
            'Nutrition',
            'Respiratory',
            'Pharmacy'
          ]),
          description: randomChoice([
            'Report',
            'Progress note',
            'Consult',
            'Addendum',
            'Correction'
          ]),
          cgid: `CG${randomInt(1000, 9999)}`,
          text: faker.lorem.paragraphs(randomInt(2, 8))
        });
      }

      // Generate microbiology events
      const microCount = randomInt(
        SEED_CONFIG.microbiologyPerAdmission.min,
        SEED_CONFIG.microbiologyPerAdmission.max
      );

      for (let micro = 0; micro < microCount; micro++) {
        microbiologyEvents.push({
          subjectId: patientId,
          admissionId,
          chartDate: faker.date.between({ from: admitTime, to: dischargeTime }),
          specTypeDesc: randomChoice(['BLOOD', 'URINE', 'SPUTUM', 'WOUND', 'CSF']),
          orgName: Math.random() < 0.7 ? randomChoice(MICROORGANISMS) : null,
          abName: randomChoice(ANTIBIOTICS),
          interpretation: randomChoice(['S', 'R', 'I', 'P']),
          comments: faker.lorem.sentence()
        });
      }
    }
  }

  return {
    patients,
    admissions,
    icuStays,
    diagnoses,
    procedures,
    prescriptions,
    labEvents,
    chartEvents,
    noteEvents,
    microbiologyEvents,
  };
}

async function insertBatchData(batchData: Awaited<ReturnType<typeof generateBatchData>>) {
  const startTime = Date.now();

  // Insert in dependency order with bulk operations
  await Promise.all([db.insert(schema.patients).values(batchData.patients)]);

  await Promise.all([db.insert(schema.admissions).values(batchData.admissions)]);

  await Promise.all([
    db.insert(schema.icuStays).values(batchData.icuStays),
    db.insert(schema.diagnosesIcd).values(batchData.diagnoses),
    db.insert(schema.proceduresIcd).values(batchData.procedures),
    db.insert(schema.prescriptions).values(batchData.prescriptions),
    db.insert(schema.labevents).values(batchData.labEvents),
    db.insert(schema.noteevents).values(batchData.noteEvents),
    db.insert(schema.microbiologyevents).values(batchData.microbiologyEvents)
  ]);

  // Chart events depend on ICU stays, so insert them after
  if (batchData.chartEvents.length > 0) {
    await db.insert(schema.chartevents).values(batchData.chartEvents);
  }

  const duration = Date.now() - startTime;
  return duration;
}

async function main() {
  console.log('🌱 Starting high-performance database seeding...');
  console.log(`📊 Target: ${SEED_CONFIG.patients} patients with ~${SEED_CONFIG.patients * 2} admissions`);
  console.log(`⚡ Batch size: ${SEED_CONFIG.batchSize} patients per batch`);

  const totalStartTime = Date.now();

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    const clearStartTime = Date.now();

    await db.delete(schema.microbiologyevents);
    await db.delete(schema.noteevents);
    await db.delete(schema.chartevents);
    await db.delete(schema.outputevents);
    await db.delete(schema.inputevents);
    await db.delete(schema.labevents);
    await db.delete(schema.prescriptions);
    await db.delete(schema.proceduresIcd);
    await db.delete(schema.diagnosesIcd);
    await db.delete(schema.transfers);
    await db.delete(schema.icuStays);
    await db.delete(schema.admissions);
    await db.delete(schema.patients);
    // await db.delete(schema.dChartitems);
    await db.delete(schema.dLabitems);
    await db.delete(schema.dIcdProcedures);
    await db.delete(schema.dIcdDiagnoses);

    console.log(`   ✅ Cleared in ${Date.now() - clearStartTime}ms`);

    // Seed reference data
    await seedReferenceData();

    // Generate and insert patient data in batches
    const totalBatches = Math.ceil(SEED_CONFIG.patients / SEED_CONFIG.batchSize);
    console.log(`👥 Processing ${totalBatches} batches...`);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * SEED_CONFIG.batchSize;
      const batchSize = Math.min(SEED_CONFIG.batchSize, SEED_CONFIG.patients - startIndex);

      console.log(`   📦 Batch ${batchIndex + 1}/${totalBatches}: Generating data for patients ${startIndex + 1}-${startIndex + batchSize}...`);

      const batchStartTime = Date.now();
      const batchData = await generateBatchData(startIndex, batchSize);
      const generateDuration = Date.now() - batchStartTime;

      console.log(`   💾 Inserting batch ${batchIndex + 1} (${Object.values(batchData).reduce((sum, arr) => sum + arr.length, 0).toLocaleString()} records)...`);
      const insertDuration = await insertBatchData(batchData);

      console.log(`   ✅ Batch ${batchIndex + 1} complete: ${generateDuration}ms gen + ${insertDuration}ms insert = ${generateDuration + insertDuration}ms total`);
    }

    const totalDuration = Date.now() - totalStartTime;
    console.log(`✅ Database seeding completed in ${totalDuration}ms (${(totalDuration / 1000).toFixed(1)}s)!`);

    // Print summary statistics
    const stats = {
      patients: (await db.select({ count: schema.patients.subjectId }).from(schema.patients)).length,
      admissions: (await db.select({ count: schema.admissions.admissionId }).from(schema.admissions))
        .length,
      icuStays: (await db.select({ count: schema.icuStays.icuStayId }).from(schema.icuStays)).length,
      labEvents: (await db.select({ count: schema.labevents.id }).from(schema.labevents)).length,
      chartEvents: (await db.select({ count: schema.chartevents.id }).from(schema.chartevents))
        .length,
      prescriptions: (
        await db.select({ count: schema.prescriptions.id }).from(schema.prescriptions)
      ).length,
      diagnoses: (await db.select({ count: schema.diagnosesIcd.id }).from(schema.diagnosesIcd))
        .length,
      procedures: (
        await db.select({ count: schema.proceduresIcd.id }).from(schema.proceduresIcd)
      ).length,
      notes: (await db.select({ count: schema.noteevents.id }).from(schema.noteevents)).length,
      microbiology: (
        await db.select({ count: schema.microbiologyevents.id }).from(schema.microbiologyevents)
      ).length
    };

    console.log('\n📈 Seeding Summary:');
    console.log(`   👥 Patients: ${stats.patients.toLocaleString()}`);
    console.log(`   🏥 Admissions: ${stats.admissions.toLocaleString()}`);
    console.log(`   🚨 ICU Stays: ${stats.icuStays.toLocaleString()}`);
    console.log(`   🧪 Lab Events: ${stats.labEvents.toLocaleString()}`);
    console.log(`   📊 Chart Events: ${stats.chartEvents.toLocaleString()}`);
    console.log(`   💊 Prescriptions: ${stats.prescriptions.toLocaleString()}`);
    console.log(`   🏥 Diagnoses: ${stats.diagnoses.toLocaleString()}`);
    console.log(`   ⚕️  Procedures: ${stats.procedures.toLocaleString()}`);
    console.log(
      `   ⚡ Performance: ${(
        Object.values(stats).reduce((a, b) => a + b, 0) /
        (totalDuration / 1000)
      ).toFixed(0)} records/second`
    );
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    console.log('🌱 Seeding finished.');
    process.exit(0);
  }
}

main().catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});