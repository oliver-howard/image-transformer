import styles from "./Toast.module.css";

interface Props {
  toast: { message: string; type: "success" | "error" } | null;
}

export function Toast({ toast }: Props) {
  if (!toast) return null;
  return (
    <div className={`${styles.toast} ${styles[toast.type]}`} role="alert">
      {toast.message}
    </div>
  );
}
