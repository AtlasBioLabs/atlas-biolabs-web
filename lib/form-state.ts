export type FormSubmissionStatus = "idle" | "success" | "error";

export type FormSubmissionState<TField extends string = string> = {
  status: FormSubmissionStatus;
  message: string;
  fieldErrors: Partial<Record<TField, string>>;
  submissionId: number;
};

export function createInitialFormState<TField extends string>(): FormSubmissionState<TField> {
  return {
    status: "idle",
    message: "",
    fieldErrors: {},
    submissionId: 0,
  };
}
