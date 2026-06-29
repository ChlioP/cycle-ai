export function Toast({ visible, message, error = false }: { visible: boolean; message: string; error?: boolean }) {
  return <div className={`toast${visible ? " show" : ""}${error ? " error" : ""}`} role={error ? "alert" : "status"} aria-live={error ? "assertive" : "polite"} aria-atomic="true">{message}</div>;
}
