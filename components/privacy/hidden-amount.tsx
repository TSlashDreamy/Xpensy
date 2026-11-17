import { HIDDEN_AMOUNT_TEXT } from "@/shared/privacy";

export default function HiddenAmount() {
  return (
    <>
      <span aria-hidden="true" className="select-none blur-[0.15em]">
        {HIDDEN_AMOUNT_TEXT}
      </span>
      <span className="sr-only">Amount hidden</span>
    </>
  );
}
