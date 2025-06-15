import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp
} from 'drizzle-orm/pg-core';

// Enums

export const genderEnum = pgEnum('gender', ['M', 'F']);
export const admissionTypeEnum = pgEnum('admission_type', [
  'ELECTIVE',
  'URGENT',
  'NEWBORN',
  'EMERGENCY'
]);
export const insuranceTypeEnum = pgEnum('insurance_type', [
  'MEDICARE',
  'MEDICAID',
  'PRIVATE',
  'GOVERNMENT',
  'SELF_PAY'
]);
export const maritalStatusEnum = pgEnum('marital_status', [
  'MARRIED',
  'SINGLE',
  'WIDOWED',
  'DIVORCED',
  'SEPARATED',
  'UNKNOWN'
]);
export const careUnitEnum = pgEnum('care_unit', [
  'MICU',
  'SICU',
  'TSICU',
  'CCU',
  'CSRU',
  'NICU',
  'NWARD'
]);
export const transferEventTypeEnum = pgEnum('transfer_event_type', ['ADMIT', 'TRANSFER', 'DISCHARGE']);
export const labFlagEnum = pgEnum('lab_flag', [
  'NORMAL',
  'ABNORMAL',
  'DELTA',
  'HIGH',
  'LOW',
  'CRITICAL_HIGH',
  'CRITICAL_LOW'
]);
export const dataSourceEnum = pgEnum('data_source', ['CAREVUE', 'METAVISION']);
export const paramTypeEnum = pgEnum('param_type', ['NUMERIC', 'TEXT', 'DATETIME']);
export const noteCategoryEnum = pgEnum('note_category', [
  'Discharge summary',
  'Nursing',
  'Nursing/other',
  'Physician',
  'Radiology',
  'Nutrition',
  'General',
  'Social Work',
  'Case Management',
  'Pharmacy',
  'Consult',
  'Respiratory',
  'Rehab Services',
  'ECG',
  'Echo'
]);

// Tables

export const patients = pgTable(
  'patients',
  {
    subjectId: text('subject_id').primaryKey(),
    gender: genderEnum('gender').notNull(),
    dateOfBirth: timestamp('date_of_birth', { withTimezone: true, mode: 'date' }).notNull(),
    dateOfDeath: timestamp('date_of_death', { withTimezone: true, mode: 'date' }),
    expireFlag: boolean('expire_flag').notNull()
  },
  (table) => ({
    genderIdx: index('patient_gender_idx').on(table.gender),
    dobIdx: index('patient_dob_idx').on(table.dateOfBirth)
  })
);

export const admissions = pgTable(
  'admissions',
  {
    admissionId: text('admission_id').primaryKey(),
    subjectId: text('subject_id')
      .notNull()
      .references(() => patients.subjectId),
    admitTime: timestamp('admit_time', { withTimezone: true, mode: 'date' }).notNull(),
    dischargeTime: timestamp('discharge_time', { withTimezone: true, mode: 'date' }),
    deathTime: timestamp('death_time', { withTimezone: true, mode: 'date' }),
    admissionType: admissionTypeEnum('admission_type').notNull(),
    admissionLocation: text('admission_location').notNull(),
    dischargeLocation: text('discharge_location'),
    insurance: insuranceTypeEnum('insurance').notNull(),
    language: text('language').notNull(),
    religion: text('religion'),
    maritalStatus: maritalStatusEnum('marital_status').notNull(),
    ethnicity: text('ethnicity').notNull(),
    edRegTime: timestamp('ed_reg_time', { withTimezone: true, mode: 'date' }),
    edOutTime: timestamp('ed_out_time', { withTimezone: true, mode: 'date' }),
    diagnosis: text('diagnosis'),
    hospitalExpireFlag: boolean('hospital_expire_flag').notNull(),
    hasCharteventsData: boolean('has_chartevents_data').notNull()
  },
  (table) => ({
    subjectIdIdx: index('admission_subject_id_idx').on(table.subjectId),
    admitTimeIdx: index('admission_admit_time_idx').on(table.admitTime),
    admissionTypeIdx: index('admission_type_idx').on(table.admissionType),
    insuranceIdx: index('admission_insurance_idx').on(table.insurance)
  })
);

export const icuStays = pgTable(
  'icustays',
  {
    icuStayId: text('icustay_id').primaryKey(),
    subjectId: text('subject_id')
      .notNull()
      .references(() => patients.subjectId),
    admissionId: text('admission_id')
      .notNull()
      .references(() => admissions.admissionId),
    careUnit: careUnitEnum('care_unit').notNull(),
    inTime: timestamp('in_time', { withTimezone: true, mode: 'date' }).notNull(),
    outTime: timestamp('out_time', { withTimezone: true, mode: 'date' }),
    lengthOfStay: real('length_of_stay')
  },
  (table) => ({
    subjectIdIdx: index('icustay_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('icustay_admission_id_idx').on(table.admissionId),
    careUnitIdx: index('icustay_care_unit_idx').on(table.careUnit),
    inTimeIdx: index('icustay_in_time_idx').on(table.inTime)
  })
);

export const transfers = pgTable(
  'transfers',
  {
    transferId: text('transfer_id').primaryKey(),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id')
      .notNull()
      .references(() => admissions.admissionId),
    eventType: transferEventTypeEnum('event_type').notNull(),
    careUnit: text('care_unit'),
    wardId: text('ward_id'),
    inTime: timestamp('in_time', { withTimezone: true, mode: 'date' }).notNull(),
    outTime: timestamp('out_time', { withTimezone: true, mode: 'date' }),
    lengthOfStay: real('length_of_stay')
  },
  (table) => ({
    subjectIdIdx: index('transfer_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('transfer_admission_id_idx').on(table.admissionId),
    eventTypeIdx: index('transfer_event_type_idx').on(table.eventType),
    inTimeIdx: index('transfer_in_time_idx').on(table.inTime)
  })
);

export const dIcdDiagnoses = pgTable('d_icd_diagnoses', {
  icd9Code: text('icd9_code').primaryKey(),
  shortTitle: text('short_title').notNull(),
  longTitle: text('long_title').notNull()
});

export const diagnosesIcd = pgTable(
  'diagnoses_icd',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id')
      .notNull()
      .references(() => admissions.admissionId),
    seqNum: integer('seq_num').notNull(),
    icd9Code: text('icd9_code')
      .notNull()
      .references(() => dIcdDiagnoses.icd9Code)
  },
  (table) => ({
    subjectIdIdx: index('diagnoses_icd_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('diagnoses_icd_admission_id_idx').on(table.admissionId),
    icd9CodeIdx: index('diagnoses_icd_icd9_code_idx').on(table.icd9Code),
    seqNumIdx: index('diagnoses_icd_seq_num_idx').on(table.seqNum)
  })
);

export const dIcdProcedures = pgTable('d_icd_procedures', {
  icd9Code: text('icd9_code').primaryKey(),
  shortTitle: text('short_title').notNull(),
  longTitle: text('long_title').notNull()
});

export const proceduresIcd = pgTable(
  'procedures_icd',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id')
      .notNull()
      .references(() => admissions.admissionId),
    seqNum: integer('seq_num').notNull(),
    icd9Code: text('icd9_code')
      .notNull()
      .references(() => dIcdProcedures.icd9Code)
  },
  (table) => ({
    subjectIdIdx: index('procedures_icd_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('procedures_icd_admission_id_idx').on(table.admissionId),
    icd9CodeIdx: index('procedures_icd_icd9_code_idx').on(table.icd9Code),
    seqNumIdx: index('procedures_icd_seq_num_idx').on(table.seqNum)
  })
);

export const prescriptions = pgTable(
  'prescriptions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id')
      .notNull()
      .references(() => admissions.admissionId),
    icuStayId: text('icustay_id'),
    startDate: timestamp('start_date', { withTimezone: true, mode: 'date' }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true, mode: 'date' }).notNull(),
    drug: text('drug').notNull(),
    drugNamePoe: text('drug_name_poe'),
    drugNameGeneric: text('drug_name_generic'),
    formularyDrugCd: text('formulary_drug_cd'),
    gsn: text('gsn'),
    ndc: text('ndc'),
    prodStrength: text('prod_strength'),
    doseValRx: text('dose_val_rx'),
    doseUnitRx: text('dose_unit_rx'),
    formValDisp: text('form_val_disp'),
    formUnitDisp: text('form_unit_disp'),
    route: text('route')
  },
  (table) => ({
    subjectIdIdx: index('prescriptions_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('prescriptions_admission_id_idx').on(table.admissionId),
    drugIdx: index('prescriptions_drug_idx').on(table.drug),
    startDateIdx: index('prescriptions_start_date_idx').on(table.startDate)
  })
);

export const dLabitems = pgTable(
  'd_labitems',
  {
    itemId: text('item_id').primaryKey(),
    label: text('label').notNull(),
    fluid: text('fluid').notNull(),
    category: text('category').notNull(),
    loincCode: text('loinc_code')
  },
  (table) => ({
    categoryIdx: index('d_labitems_category_idx').on(table.category),
    fluidIdx: index('d_labitems_fluid_idx').on(table.fluid)
  })
);

export const labevents = pgTable(
  'labevents',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id')
      .notNull()
      .references(() => admissions.admissionId),
    itemId: text('item_id')
      .notNull()
      .references(() => dLabitems.itemId),
    chartTime: timestamp('chart_time', { withTimezone: true, mode: 'date' }).notNull(),
    value: text('value'),
    valueNum: real('value_num'),
    valueUom: text('value_uom'),
    flag: labFlagEnum('flag')
  },
  (table) => ({
    subjectIdIdx: index('labevents_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('labevents_admission_id_idx').on(table.admissionId),
    itemIdIdx: index('labevents_item_id_idx').on(table.itemId),
    chartTimeIdx: index('labevents_chart_time_idx').on(table.chartTime),
    flagIdx: index('labevents_flag_idx').on(table.flag)
  })
);

export const dItems = pgTable(
  'd_items',
  {
    itemId: text('item_id').primaryKey(),
    label: text('label').notNull(),
    abbreviation: text('abbreviation'),
    dbsource: dataSourceEnum('dbsource').notNull(),
    linksto: text('linksto'),
    category: text('category').notNull(),
    unitname: text('unitname'),
    paramType: paramTypeEnum('param_type').notNull(),
    conceptId: text('concept_id')
  },
  (table) => ({
    categoryIdx: index('d_items_category_idx').on(table.category),
    dbsourceIdx: index('d_items_dbsource_idx').on(table.dbsource),
    paramTypeIdx: index('d_items_param_type_idx').on(table.paramType)
  })
);

export const chartevents = pgTable(
  'chartevents',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id')
      .notNull()
      .references(() => admissions.admissionId),
    icuStayId: text('icustay_id').references(() => icuStays.icuStayId),
    itemId: text('item_id')
      .notNull()
      .references(() => dItems.itemId),
    chartTime: timestamp('chart_time', { withTimezone: true, mode: 'date' }).notNull(),
    storeTime: timestamp('store_time', { withTimezone: true, mode: 'date' }),
    cgid: text('cgid'),
    value: text('value'),
    valueNum: real('value_num'),
    valueUom: text('value_uom'),
    warning: boolean('warning').default(false),
    error: boolean('error').default(false),
    resultstatus: text('result_status'),
    stopped: text('stopped')
  },
  (table) => ({
    subjectIdIdx: index('chartevents_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('chartevents_admission_id_idx').on(table.admissionId),
    icuStayIdIdx: index('chartevents_icustay_id_idx').on(table.icuStayId),
    itemIdIdx: index('chartevents_item_id_idx').on(table.itemId),
    chartTimeIdx: index('chartevents_chart_time_idx').on(table.chartTime)
  })
);

export const inputevents = pgTable(
  'inputevents',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id').notNull(),
    icuStayId: text('icustay_id')
      .notNull()
      .references(() => icuStays.icuStayId),
    startTime: timestamp('start_time', { withTimezone: true, mode: 'date' }).notNull(),
    endTime: timestamp('end_time', { withTimezone: true, mode: 'date' }).notNull(),
    itemId: text('item_id').notNull(),
    amount: real('amount'),
    amountUom: text('amount_uom'),
    rate: real('rate'),
    rateUom: text('rate_uom'),
    orderid: text('orderid'),
    linkorderid: text('linkorderid'),
    ordercategoryname: text('order_category_name'),
    secondaryordercategoryname: text('secondary_order_category_name'),
    ordercomponenttypedescription: text('order_component_type_description'),
    ordercategorydescription: text('order_category_description'),
    patientweight: real('patient_weight'),
    totalamount: real('total_amount'),
    totalamountuom: text('total_amount_uom'),
    isopenbag: boolean('is_open_bag'),
    continueinnextdept: boolean('continue_in_next_dept'),
    cancelreason: text('cancel_reason'),
    statusdescription: text('status_description')
  },
  (table) => ({
    subjectIdIdx: index('inputevents_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('inputevents_admission_id_idx').on(table.admissionId),
    icuStayIdIdx: index('inputevents_icustay_id_idx').on(table.icuStayId),
    startTimeIdx: index('inputevents_start_time_idx').on(table.startTime),
    itemIdIdx: index('inputevents_item_id_idx').on(table.itemId)
  })
);

export const outputevents = pgTable(
  'outputevents',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id').notNull(),
    icuStayId: text('icustay_id')
      .notNull()
      .references(() => icuStays.icuStayId),
    chartTime: timestamp('chart_time', { withTimezone: true, mode: 'date' }).notNull(),
    itemId: text('item_id').notNull(),
    value: real('value').notNull(),
    valueUom: text('value_uom').notNull()
  },
  (table) => ({
    subjectIdIdx: index('outputevents_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('outputevents_admission_id_idx').on(table.admissionId),
    icuStayIdIdx: index('outputevents_icustay_id_idx').on(table.icuStayId),
    chartTimeIdx: index('outputevents_chart_time_idx').on(table.chartTime),
    itemIdIdx: index('outputevents_item_id_idx').on(table.itemId)
  })
);

export const noteevents = pgTable(
  'noteevents',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id')
      .notNull()
      .references(() => admissions.admissionId),
    chartDate: timestamp('chart_date', { withTimezone: true, mode: 'date' }).notNull(),
    chartTime: timestamp('chart_time', { withTimezone: true, mode: 'date' }),
    storeTime: timestamp('store_time', { withTimezone: true, mode: 'date' }),
    category: noteCategoryEnum('category').notNull(),
    description: text('description').notNull(),
    cgid: text('cgid'),
    iserror: boolean('is_error'),
    text: text('text')
  },
  (table) => ({
    subjectIdIdx: index('noteevents_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('noteevents_admission_id_idx').on(table.admissionId),
    categoryIdx: index('noteevents_category_idx').on(table.category),
    chartDateIdx: index('noteevents_chart_date_idx').on(table.chartDate)
  })
);

export const microbiologyevents = pgTable(
  'microbiologyevents',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text('subject_id').notNull(),
    admissionId: text('admission_id')
      .notNull()
      .references(() => admissions.admissionId),
    chartDate: timestamp('chart_date', { withTimezone: true, mode: 'date' }).notNull(),
    chartTime: timestamp('chart_time', { withTimezone: true, mode: 'date' }),
    specItemId: text('spec_item_id'),
    specTypeDesc: text('spec_type_desc'),
    orgItemId: text('org_item_id'),
    orgName: text('org_name'),
    isolateNum: integer('isolate_num'),
    abItemId: text('ab_item_id'),
    abName: text('ab_name'),
    dilutionText: text('dilution_text'),
    dilutionComparison: text('dilution_comparison'),
    dilutionValue: real('dilution_value'),
    interpretation: text('interpretation'),
    comments: text('comments')
  },
  (table) => ({
    subjectIdIdx: index('microbiologyevents_subject_id_idx').on(table.subjectId),
    admissionIdIdx: index('microbiologyevents_admission_id_idx').on(table.admissionId),
    chartDateIdx: index('microbiologyevents_chart_date_idx').on(table.chartDate),
    orgNameIdx: index('microbiologyevents_org_name_idx').on(table.orgName),
    interpretationIdx: index('microbiologyevents_interpretation_idx').on(table.interpretation)
  })
);

// Relations

export const patientRelations = relations(patients, ({ one, many }) => ({
  admissions: many(admissions),
  icuStays: many(icuStays)
}));

export const admissionRelations = relations(admissions, ({ one, many }) => ({
  patient: one(patients, {
    fields: [admissions.subjectId],
    references: [patients.subjectId]
  }),
  icuStays: many(icuStays),
  transfers: many(transfers),
  diagnoses: many(diagnosesIcd),
  procedures: many(proceduresIcd),
  prescriptions: many(prescriptions),
  labEvents: many(labevents),
  chartEvents: many(chartevents),
  noteEvents: many(noteevents),
  microbiologyEvents: many(microbiologyevents)
}));

export const icuStayRelations = relations(icuStays, ({ one, many }) => ({
  patient: one(patients, {
    fields: [icuStays.subjectId],
    references: [patients.subjectId]
  }),
  admission: one(admissions, {
    fields: [icuStays.admissionId],
    references: [admissions.admissionId]
  }),
  inputEvents: many(inputevents),
  outputEvents: many(outputevents),
  chartEvents: many(chartevents)
}));

export const transferRelations = relations(transfers, ({ one }) => ({
  admission: one(admissions, {
    fields: [transfers.admissionId],
    references: [admissions.admissionId]
  })
}));

export const diagnosisIcdRelations = relations(diagnosesIcd, ({ one }) => ({
  admission: one(admissions, {
    fields: [diagnosesIcd.admissionId],
    references: [admissions.admissionId]
  }),
  diagnosisInfo: one(dIcdDiagnoses, {
    fields: [diagnosesIcd.icd9Code],
    references: [dIcdDiagnoses.icd9Code]
  })
}));

export const dIcdDiagnosisRelations = relations(dIcdDiagnoses, ({ many }) => ({
  diagnoses: many(diagnosesIcd)
}));

export const procedureIcdRelations = relations(proceduresIcd, ({ one }) => ({
  admission: one(admissions, {
    fields: [proceduresIcd.admissionId],
    references: [admissions.admissionId]
  }),
  procedureInfo: one(dIcdProcedures, {
    fields: [proceduresIcd.icd9Code],
    references: [dIcdProcedures.icd9Code]
  })
}));

export const dIcdProcedureRelations = relations(dIcdProcedures, ({ many }) => ({
  procedures: many(proceduresIcd)
}));

export const prescriptionRelations = relations(prescriptions, ({ one }) => ({
  admission: one(admissions, {
    fields: [prescriptions.admissionId],
    references: [admissions.admissionId]
  })
}));

export const labEventRelations = relations(labevents, ({ one }) => ({
  admission: one(admissions, {
    fields: [labevents.admissionId],
    references: [admissions.admissionId]
  }),
  labItem: one(dLabitems, {
    fields: [labevents.itemId],
    references: [dLabitems.itemId]
  })
}));

export const dLabItemRelations = relations(dLabitems, ({ many }) => ({
  labEvents: many(labevents)
}));

export const chartEventRelations = relations(chartevents, ({ one }) => ({
  admission: one(admissions, {
    fields: [chartevents.admissionId],
    references: [admissions.admissionId]
  }),
  icuStay: one(icuStays, {
    fields: [chartevents.icuStayId],
    references: [icuStays.icuStayId]
  }),
  chartItem: one(dItems, {
    fields: [chartevents.itemId],
    references: [dItems.itemId]
  })
}));

export const dItemRelations = relations(dItems, ({ many }) => ({
  chartEvents: many(chartevents)
}));

export const inputEventRelations = relations(inputevents, ({ one }) => ({
  icuStay: one(icuStays, {
    fields: [inputevents.icuStayId],
    references: [icuStays.icuStayId]
  })
}));

export const outputEventRelations = relations(outputevents, ({ one }) => ({
  icuStay: one(icuStays, {
    fields: [outputevents.icuStayId],
    references: [icuStays.icuStayId]
  })
}));

export const noteEventRelations = relations(noteevents, ({ one }) => ({
  admission: one(admissions, {
    fields: [noteevents.admissionId],
    references: [admissions.admissionId]
  })
}));

export const microbiologyEventRelations = relations(microbiologyevents, ({ one }) => ({
  admission: one(admissions, {
    fields: [microbiologyevents.admissionId],
    references: [admissions.admissionId]
  })
}));
